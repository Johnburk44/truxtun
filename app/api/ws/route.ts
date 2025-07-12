import { createClient } from '@deepgram/sdk';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

// Using any for Deepgram types due to version mismatch
type DeepgramConnection = any;

export const runtime = 'edge';

export async function GET(req: Request) {
  if (!req.headers.get('upgrade')?.includes('websocket')) {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  const webSocket = new WebSocket(req.url);

  let deepgramLive: DeepgramConnection | null = null;
  let crmContext: Record<string, any> = {};

  webSocket.onopen = () => {
    console.log('Client connected');
  };

  webSocket.onmessage = async (event: MessageEvent) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'startTranscription':
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
          dgConnection.addListener('error', (err: Error) => console.error('Deepgram error:', err));
          dgConnection.addListener('close', () => console.log('Deepgram WebSocket closed'));
          
          dgConnection.addListener('transcriptReceived', async (data: any) => {
            console.log('Received raw Deepgram data:', data);
            const transcript = data?.channel?.alternatives?.[0]?.transcript;
            if (transcript) {
              console.log('Processing transcript:', transcript);
              const enriched = await enrichWithRAG(transcript, crmContext);
              console.log('Sending enriched transcript to client');
              webSocket.send(JSON.stringify({ type: 'transcript', data: { transcript, enriched } }));
            } else {
              console.log('No transcript in Deepgram response');
            }
          });
        } catch (error) {
          console.error('Error starting transcription:', error);
        }
        break;

      case 'audioChunk':
        console.log('Received audio chunk');
        if (deepgramLive) {
          deepgramLive.send(data.data);
        } else {
          console.warn('No active Deepgram connection');
        }
        break;

      case 'stopTranscription':
        console.log('Stopping transcription');
        if (deepgramLive) {
          deepgramLive.finish();
          deepgramLive = null;
        }
        break;
    }
  };

  webSocket.onclose = () => {
    console.log('Client disconnected');
    if (deepgramLive) {
      deepgramLive.finish();
      deepgramLive = null;
    }
  };

  const { readable, writable } = new WebSocketStream(webSocket);
  return new Response(null, {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
    },
  });
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
