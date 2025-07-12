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
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Configuration
const port = process.env.PORT || 3001;

console.log('Starting server on port:', port);

// Create HTTP server
const server = createServer();

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
// Socket.IO connection handling



// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    let deepgramLive = null;

    socket.on('startTranscription', async (data) => {
      console.log('startTranscription received from client:', socket.id);
      try {
        console.log('Starting transcription for client:', socket.id, 'with context:', data);
        
        deepgramLive = deepgram.listen.live({
          model: 'nova-2',
          language: 'en',
          smart_format: true,
          interim_results: true,
          utterances: true,
          encoding: 'opus',
          channels: 1,
          sample_rate: 48000, // Match browser mic
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

        deepgramLive.addListener('transcriptReceived', (transcriptData) => {
          console.log('Received transcript for client:', socket.id);
          const transcript = transcriptData?.channel?.alternatives?.[0]?.transcript;
          if (transcript) {
            console.log('Sending transcript:', transcript);
            socket.emit('transcript', { transcript });
          }
        });
      } catch (error) {
        console.error('Error starting transcription:', error);
        socket.emit('error', { message: 'Failed to start transcription' });
      }
    });

    socket.on('audioChunk', async (data) => {
      try {
        const size = data instanceof ArrayBuffer ? data.byteLength : (data instanceof Blob ? data.size : 'unknown');
        console.log('Received audio chunk from client:', socket.id, 'size:', size, 'type:', data.constructor.name);

        if (!deepgramLive) {
          console.warn('No active Deepgram connection for client:', socket.id);
          socket.emit('error', { message: 'No active transcription session' });
          return;
        }

        // Convert Blob to ArrayBuffer if needed
        let audioBuffer;
        if (data instanceof Blob) {
          const reader = new FileReader();
          audioBuffer = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(data);
          });
          console.log('Converted Blob to ArrayBuffer, size:', audioBuffer.byteLength);
        } else if (data instanceof ArrayBuffer) {
          audioBuffer = data;
          console.log('Using ArrayBuffer directly, size:', audioBuffer.byteLength);
        } else {
          console.warn('Unsupported audio data type:', typeof data, data?.constructor?.name);
          socket.emit('error', { message: 'Invalid audio format' });
          return;
        }

        try {
          await deepgramLive.send(audioBuffer);
          console.log('Successfully sent audio chunk to Deepgram');
        } catch (err) {
          console.error('Error sending to Deepgram:', err);
          socket.emit('error', { message: 'Failed to process audio' });
        }
      } catch (err) {
        console.error('Error processing audio chunk:', err);
        socket.emit('error', { message: 'Failed to process audio chunk' });
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

// Start server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});