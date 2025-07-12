import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { createClient } from '@deepgram/sdk';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import dotenv from 'dotenv';

// Try to load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Warn about missing environment variables but don't exit
if (!process.env.DEEPGRAM_API_KEY) {
  console.warn('Warning: DEEPGRAM_API_KEY is not set. Transcription will not work.');
}

const hostname = 'localhost';
const port = 3001; // Socket.IO server port

console.log('Starting Socket.IO server on port:', port);

const httpServer = createServer();
console.log('Created HTTP server');

console.log('Attaching Socket.IO...');

const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling'],
    path: '/socket.io/'
  });

  console.log('Socket.IO server created with configuration:', io.engine.opts);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    let deepgramLive; // Per-client Deepgram instance

    socket.on('startTranscription', (context) => {
      console.log('Starting transcription for client:', socket.id, 'with context:', context);
      const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
      deepgramLive = deepgram.listen.live({
        model: 'nova-2',
        language: 'en',
        smart_format: true,
        interim_results: true,
        utterances: true,
        encoding: 'opus',
        channels: 1,
        sample_rate: 48000, // Match common browser mic
      });

      deepgramLive.on('open', () => console.log('Deepgram connection open for client:', socket.id));

      deepgramLive.on('transcriptReceived', async (data) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        if (transcript) {
          console.log('Transcript received:', transcript);
          const enriched = await enrichWithRAG(transcript, context.crmContext);
          socket.emit('transcript', { transcript, enriched });
        }
      });

      deepgramLive.on('close', () => console.log('Deepgram connection closed for client:', socket.id));
      deepgramLive.on('error', (error) => console.error('Deepgram error for client:', socket.id, error));
    });

    socket.on('audioChunk', (audioData) => {
      if (deepgramLive && deepgramLive.getReadyState() === 1) {
        console.log('Sending audio chunk to Deepgram');
        deepgramLive.send(audioData);
      } else {
        console.log('Ignoring late audio chunk - session closed');
        // No socket.emit('error') for this case
      }
    });

    socket.on('stopTranscription', () => {
      if (deepgramLive) {
        console.log('Stopping transcription for client:', socket.id);
        deepgramLive.finish();
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (deepgramLive) {
        deepgramLive.finish();
      }
    });
  });

console.log('Attempting to start server...');
httpServer.listen(port, hostname, () => {
  console.log(`> Server listening on http://${hostname}:${port}`);
  console.log('> Socket.IO server ready for connections');
});

httpServer.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// RAG functions (typed for TS)
async function enrichWithRAG(transcript: string, crmContext: any): Promise<string> {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.index(process.env.PINECONE_INDEX_NAME || 'truxtun-sales');

    const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' });
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });

    const model = new ChatOpenAI({ modelName: 'gpt-4o-mini' });
    const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), { returnSourceDocuments: true });

    const response = await chain.call({
      question: `Enrich this sales transcript with buyer intent, deal stage from CRM: ${transcript}. Context: ${JSON.stringify(crmContext)}`,
      chat_history: [],
    });

    return response.text;
  } catch (error) {
    console.error('RAG error:', error);
    return 'Enrichment failed - check server logs';
  }
}