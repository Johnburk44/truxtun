const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('audioChunk', (data) => {
    console.log('Received audio chunk');
    socket.emit('transcript', {
      transcript: 'Test transcript',
      enriched: 'Test enrichment'
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
