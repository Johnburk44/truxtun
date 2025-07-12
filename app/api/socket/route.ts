import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
import { createClient } from '@deepgram/sdk';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Using any for Deepgram types due to version mismatch
type DeepgramConnection = any;

// Store active connections and Socket.IO server
let io: Server | null = null;

// Initialize Socket.IO server
function initSocketIO() {
  if (!io) {
    io = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected');

      let deepgramLive: DeepgramConnection | null = null;
      let crmContext: Record<string, any> = {};

      socket.on('startTranscription', async (data) => {
        console.log('Starting transcription with context:', data);
        crmContext = data.crmContext;
        
        try {
          if (!process.env.DEEPGRAM_API_KEY) {
            throw new Error('DEEPGRAM_API_KEY is not set');
          }
          const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
          
          console.log('Setting up Deepgram live transcription...');
          
          const dgConnection = deepgram.listen.live({
            model: 'nova-2',
            language: 'en-US',
            smart_format: true,
            interim_results: true,
            utterances: true,
          });

          deepgramLive = dgConnection;

          dgConnection.addListener('open', () => console.log('Deepgram WebSocket opened'));
          dgConnection.addListener('error', (err) => console.error('Deepgram error:', err));
          dgConnection.addListener('close', () => console.log('Deepgram WebSocket closed'));
          
          dgConnection.addListener('transcriptReceived', async (data) => {
            console.log('Received raw Deepgram data:', data);
            const transcript = data?.channel?.alternatives?.[0]?.transcript;
            if (transcript) {
              console.log('Processing transcript:', transcript);
              const enriched = await enrichWithRAG(transcript, crmContext);
              console.log('Sending enriched transcript to client');
              socket.emit('transcript', { transcript, enriched });
            } else {
              console.log('No transcript in Deepgram response');
            }
          });
        } catch (error) {
          console.error('Error starting transcription:', error);
        }
      });

      socket.on('audioChunk', (data) => {
        console.log('Received audio chunk');
        if (deepgramLive) {
          deepgramLive.send(data);
        } else {
          console.warn('No active Deepgram connection');
        }
      });

      socket.on('stopTranscription', () => {
        console.log('Stopping transcription');
        if (deepgramLive) {
          deepgramLive.finish();
          deepgramLive = null;
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (deepgramLive) {
          deepgramLive.finish();
          deepgramLive = null;
        }
      });
    });
  }
}

// RAG Enrichment
async function enrichWithRAG(transcript: string, crmContext: Record<string, any>) {
  try {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set');
    }
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
      throw new Error('PINECONE_INDEX_NAME is not set');
    }
    const index = pc.index(indexName);

    const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' });
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });

    const model = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.7,
    });

    // @ts-ignore - Type mismatch between LangChain versions
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model as any, // Type cast to avoid version mismatch
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: true,
      }
    );

    const enriched = await chain.call({
      question: transcript,
      chat_history: [],
    });

    return enriched.text;
  } catch (error) {
    console.error('Error enriching transcript:', error);
    return 'Error enriching transcript';
  }
}

// Handle HTTP requests
export async function GET(req: Request) {
  if (!io) {
    initSocketIO();
  }

  const { searchParams } = new URL(req.url);
  const transport = searchParams.get('transport');
  const sid = searchParams.get('sid');

  if (!transport) {
    return NextResponse.json({ ok: true });
  }

  if (transport === 'websocket') {
    if (sid) {
      const res = await io?.handleUpgrade(req, sid);
      if (res) {
        return new Response(res.body, {
          status: res.status,
          headers: res.headers,
        });
      }
    }
    const res = await io?.handleUpgrade(req);
    if (res) {
      return new Response(res.body, {
        status: res.status,
        headers: res.headers,
      });
    }
  }

  const res = await io?.handleRequest(req);
  if (res) {
    return new Response(res.body, {
      status: res.status,
      headers: res.headers,
    });
  }

  return new Response('Socket.IO server error', { status: 500 });
}
