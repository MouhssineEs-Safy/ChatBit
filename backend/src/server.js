import http from 'http';
import app from './app.js';
import { config } from './config/env.js';
import { verifyDbConnection } from './config/db.js';
import { initSocket } from './socket/index.js';

const server = http.createServer(app);

// Initialize Socket.IO with auth middleware & event handlers
const io = initSocket(server);

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

