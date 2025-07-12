const { createServer } = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@deepgram/sdk');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const result = dotenv.config({ path: '.env.local' });
if (result.error) {
  throw result.error;
}
console.log('Environment variables loaded successfully');

// Verify environment variables
if (!process.env.DEEPGRAM_API_KEY) {
  throw new Error('DEEPGRAM_API_KEY is not set');
}

// Initialize Deepgram
let deepgram;
try {
  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error('DEEPGRAM_API_KEY is not set');
  }
  deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  console.log('Deepgram client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Deepgram:', error);
  process.exit(1);
}

// Configuration
const port = process.env.PORT || 3001;

console.log('Starting server on port:', port);

// Create HTTP server
const server = createServer((req, res) => {
  console.log('Request URL:', req.url);
  res.writeHead(404);
  res.end('Not found');
});

// Create Socket.IO server with basic configuration
const io = new Server(server, {
  cors: {
    origin: '*',  // In production, set this to your specific domain
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket']
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  let deepgramLive = null;
  let isDeepgramReady = false;

  socket.on('startTranscription', async (data) => {
    console.log('startTranscription received from client:', socket.id);
    try {
      if (!deepgram?.listen?.live) {
        throw new Error('Deepgram client not properly initialized');
      }
      console.log('Starting transcription for client:', socket.id);
      
      // Create new Deepgram live transcription instance
      deepgramLive = deepgram.listen.live({
        model: 'nova-2',
        language: 'en',
        smart_format: true,
        interim_results: true,
        utterances: true,
        encoding: 'opus',
        channels: 1,
        sample_rate: 48000,
      });

      // Wait for connection to be ready
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Deepgram connection timeout'));
        }, 5000);

        deepgramLive.addListener('open', () => {
          console.log('Deepgram connection opened for client:', socket.id);
          clearTimeout(timeout);
          resolve();
        });

        deepgramLive.addListener('error', (err) => {
          console.error('Deepgram error for client:', socket.id, err);
          clearTimeout(timeout);
          reject(err);
        });
      });

      // Only set up other listeners after connection is confirmed
      deepgramLive.addListener('transcriptReceived', (transcriptData) => {
        console.log('Received transcript for client:', socket.id);
        const transcript = transcriptData?.channel?.alternatives?.[0]?.transcript;
        if (transcript) {
          console.log('Sending transcript:', transcript);
          socket.emit('transcript', { transcript });
        }
      });

      deepgramLive.addListener('close', () => {
        console.log('Deepgram connection closed for client:', socket.id);
      });

      // Mark connection as ready and signal client
      isDeepgramReady = true;
      socket.emit('ready', { message: 'Transcription ready' });
    } catch (error) {
      console.error('Error starting transcription:', error);
      socket.emit('error', { message: 'Failed to start transcription: ' + error.message });
      if (deepgramLive) {
        try {
          deepgramLive.finish();
        } catch (e) {
          console.error('Error finishing Deepgram connection:', e);
        }
        deepgramLive = null;
      }
    }
  });

  socket.on('audioChunk', async (data) => {
    try {
      if (!deepgramLive || !isDeepgramReady) {
        console.warn('Deepgram not ready for client:', socket.id, { hasConnection: !!deepgramLive, isReady: isDeepgramReady });
        socket.emit('error', { message: 'Transcription service not ready' });
        return;
      }

      console.log('Raw audio chunk type:', typeof data, 'instanceof ArrayBuffer:', data instanceof ArrayBuffer);
      
      // Convert to Buffer if it's an ArrayBuffer
      const audioBuffer = data instanceof ArrayBuffer ? Buffer.from(data) : data;
      console.log('Converted audio chunk:', {
        isBuffer: Buffer.isBuffer(audioBuffer),
        length: audioBuffer.length,
        clientId: socket.id
      });

      try {
        await deepgramLive.send(audioBuffer);
        console.log('Successfully sent audio chunk to Deepgram');
      } catch (err) {
        console.error('Error sending to Deepgram:', err);
        socket.emit('error', { message: 'Failed to process audio: ' + err.message });
      }
    } catch (err) {
      console.error('Error processing audio chunk:', err);
      socket.emit('error', { message: 'Failed to process audio chunk: ' + err.message });
    }
  });

  socket.on('stopTranscription', () => {
    console.log('Stopping transcription for client:', socket.id);
    if (deepgramLive) {
      deepgramLive.finish();
      deepgramLive = null;
      isDeepgramReady = false;
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
      isDeepgramReady = false;
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error for client:', socket.id, error);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});