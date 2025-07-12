const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

// Test audio data (simulated)
const testAudioChunk = new Uint8Array(1024).fill(1);

// Handle connection events
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Simulate sending audio chunks
  setInterval(() => {
    console.log('Sending audio chunk...');
    socket.emit('audioChunk', testAudioChunk);
  }, 2000); // Every 2 seconds
});

// Handle transcript responses
socket.on('transcript', (data) => {
  console.log('Received transcript:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Keep the script running
process.stdin.resume();
