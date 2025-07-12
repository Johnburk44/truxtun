console.log('Starting server script...');

console.log('Starting server script...');

import http from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import { createClient } from '@deepgram/sdk';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

try {
  // Load and verify environment variables
  const requiredEnvVars = ['DEEPGRAM_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX_NAME'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  console.log('Environment variables loaded successfully');
  console.log('Starting server with configuration:', { 
    dev, 
    hostname, 
    port,
    envVarsPresent: requiredEnvVars
  });

  const app = next({ dev, hostname, port });
  const handler = app.getRequestHandler();

app.prepare().then(() => {
  console.log('Next.js app prepared, setting up server...');

  const httpServer = http.createServer((req, res) => {
    if (req.url?.startsWith('/socket.io')) {
      res.writeHead(400);
      res.end('Socket.IO endpoint');
      return;
    }
    return handler(req, res);
  });

  console.log('Created HTTP server, attaching Socket.IO...');

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling'],
    path: '/socket.io/'
  });

  console.log('Socket.IO server created');

  io.on('connection', (socket) => {
    console.log('Client connected');
    
    let deepgramLive: any = null;
    let crmContext: any = {};

    socket.on('startTranscription', async (data) => {
      console.log('Starting transcription with context:', data);
      crmContext = data.crmContext;
      
      try {
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
        
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
            socket.emit('transcript', { transcript, enriched });
          } else {
            console.log('No transcript in Deepgram response');
          }
        });
      } catch (error) {
        console.error('Error starting transcription:', error);
      }
    });

    socket.on('audioChunk', async (audioData) => {
      console.log('Received audio chunk, size:', audioData.size);
      if (deepgramLive) {
        try {
          deepgramLive.send(audioData);
          console.log('Sent audio chunk to Deepgram');
        } catch (error) {
          console.error('Error processing audio:', error);
        }
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

  httpServer.listen(port, hostname, () => {
    console.log(`> Server listening on http://${hostname}:${port}`);
    console.log('> Socket.IO server ready for connections');
  });

  httpServer.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });

  // Keep the process alive
  process.stdin.resume();
  console.log('Server is running. Press Ctrl+C to stop.');
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
} catch (error) {
  console.error('Server initialization error:', error);
  process.exit(1);
}

async function enrichWithRAG(transcript: string, crmContext: any) {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(process.env.PINECONE_INDEX_NAME || 'truxtun-sales');

  const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' });
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });

  const model = new ChatOpenAI({ modelName: 'gpt-4-turbo-preview' });
  const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), { returnSourceDocuments: true });

  const response = await chain.call({
    question: `Enrich this sales transcript with buyer intent, deal stage from CRM: ${transcript}. Context: ${JSON.stringify(crmContext)}`,
    chat_history: [],
  });

  return response.text;
}

async function upsertSampleData() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pc.index(process.env.PINECONE_INDEX_NAME || 'truxtun-sales');

  const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' });

  const sampleDocs = [
    new Document({ pageContent: 'Buyer persona: CTO in fintech, focused on ROI and security.', metadata: { source: 'CRM' } }),
    new Document({ pageContent: 'Deal stage: Discovery - Discussing pain points like pricing pushback.', metadata: { source: 'History' } }),
    new Document({ pageContent: 'Common objections: Security compliance, integration complexity.', metadata: { source: 'Sales' } }),
    new Document({ pageContent: 'Value props: 30% cost reduction, 2x efficiency gain.', metadata: { source: 'Marketing' } })
  ];

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const splitDocs = await splitter.splitDocuments(sampleDocs);

  await PineconeStore.fromDocuments(splitDocs, embeddings, { pineconeIndex: index });
  console.log('Sample data upserted!');
}
