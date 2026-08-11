import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { config } from './config/env.js';
import { verifyDbConnection } from './config/db.js';

const server = http.createServer(app);

// Initialize Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: config.clientOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

const startServer = async () => {
  try {
    // Verify PostgreSQL connection at startup
    await verifyDbConnection();

    server.listen(config.port, () => {
      console.log(`ChatBit server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export { server, io };
