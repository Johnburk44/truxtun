const { createServer } = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@deepgram/sdk');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });
const { PineconeClient } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { PineconeStore } = require('@langchain/pinecone');
const { ChatOpenAI } = require('@langchain/openai');
const { ConversationalRetrievalQAChain } = require('langchain/chains');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

// Keep process alive
process.stdin.resume();

// Initialize Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

// Verify environment variables
if (!process.env.DEEPGRAM_API_KEY) {
  throw new Error('DEEPGRAM_API_KEY is not set');
}
if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set');
}
if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('PINECONE_INDEX_NAME is not set');
}

console.log('Environment variables loaded successfully');
console.log('Starting server with configuration:', { dev, port });

// RAG Enrichment function
async function enrichWithRAG(transcript, context) {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.index(process.env.PINECONE_INDEX_NAME);

    const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' });
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });

    const model = new ChatOpenAI({ modelName: 'gpt-4-turbo-preview' });
    const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), { returnSourceDocuments: true });

    const response = await chain.call({
      question: `Enrich this sales transcript with buyer intent, deal stage from CRM: ${transcript}. Context: ${JSON.stringify(context)}`,
      chat_history: [],
    });

    return response.text;
  } catch (error) {
    console.error('RAG error:', error);
    return 'Enrichment failed - check server logs';
  }
}

// Start server
app.prepare().then(() => {
  const server = createServer((req, res) => {
    if (req.url?.startsWith('/api/socket')) {
      res.writeHead(400);
      res.end('WebSocket endpoint');
      return;
    }
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['*'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    let deepgramLive = null;

    socket.on('startTranscription', async (data) => {
      console.log('startTranscription received from client:', socket.id);
      try {
        console.log('Starting transcription for client:', socket.id, 'with context:', data);
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
        
        deepgramLive = deepgram.listen.live({
          model: 'nova-2',
          language: 'en-US',
          smart_format: true,
          interim_results: true,
          utterances: true,
        });

        deepgramLive.addListener('open', () => {
          console.log('Deepgram connection opened for client:', socket.id);
        });

        deepgramLive.addListener('error', (err) => {
          console.error('Deepgram error for client:', socket.id, err);
          socket.emit('error', { message: 'Transcription error' });
        });

        deepgramLive.addListener('close', () => {
          console.log('Deepgram connection closed for client:', socket.id);
        });

        deepgramLive.addListener('transcriptReceived', async (transcriptData) => {
          console.log('Received transcript for client:', socket.id);
          const transcript = transcriptData?.channel?.alternatives?.[0]?.transcript;
          if (transcript) {
            console.log('Processing transcript:', transcript);
            try {
              const enriched = await enrichWithRAG(transcript, data.crmContext);
              socket.emit('transcript', { transcript, enriched });
            } catch (err) {
              console.error('Error enriching transcript:', err);
              socket.emit('error', { message: 'Enrichment error' });
            }
          }
        });
      } catch (error) {
        console.error('Error starting transcription:', error);
        socket.emit('error', { message: 'Failed to start transcription' });
      }
    });

    socket.on('audioChunk', (data) => {
      const size = data instanceof ArrayBuffer ? data.byteLength : (data instanceof Blob ? data.size : 'unknown');
      console.log('Received audio chunk from client:', socket.id, 'size:', size, 'type:', data.constructor.name);
      if (deepgramLive) {
        // Convert Blob to ArrayBuffer if needed
        if (data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            console.log('Sending ArrayBuffer to Deepgram, size:', reader.result.byteLength);
          deepgramLive.send(reader.result);
          };
          reader.readAsArrayBuffer(data);
        } else if (data instanceof ArrayBuffer) {
          console.log('Sending ArrayBuffer directly to Deepgram, size:', data.byteLength);
          deepgramLive.send(data);
        } else {
          console.warn('Unsupported audio data type:', typeof data, data?.constructor?.name);
        }
      } else {
        console.warn('No active Deepgram connection for client:', socket.id);
      }
    });

    socket.on('stopTranscription', () => {
      console.log('Stopping transcription for client:', socket.id);
      if (deepgramLive) {
        deepgramLive.finish();
        deepgramLive = null;
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, 'reason:', reason);
      if (deepgramLive) {
        try {
          deepgramLive.finish();
        } catch (error) {
          console.error('Error finishing Deepgram connection:', error);
        }
        deepgramLive = null;
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error for client:', socket.id, error);
    });
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((err) => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
});