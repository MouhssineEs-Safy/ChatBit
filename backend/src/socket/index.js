import { Server } from 'socket.io';
import { config } from '../config/env.js';
import { socketAuthMiddleware } from './socket.auth.js';
import { handleConversationJoin, handleConversationLeave } from './handlers/conversation.handler.js';
import { handleMessageSend } from './handlers/message.handler.js';
import { handleTypingStart, handleTypingStop } from './handlers/typing.handler.js';
import { handleUserConnected, handleUserDisconnected } from './handlers/presence.handler.js';
import { EVENTS } from './events.js';

/**
 * Initializes Socket.IO server, registers authentication middleware, and wires up event handlers.
 *
 * @param {import('http').Server} server - HTTP Server instance
 * @returns {Server} Socket.IO server instance
 */
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.clientOrigin,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });

  // 1. Socket authentication middleware (validates JWT, attaches socket.user)
  io.use(socketAuthMiddleware);

  // 2. Wire event handlers upon connection
  io.on('connection', (socket) => {
    // User presence online
    handleUserConnected(io, socket);

    // Conversation room handlers (with PostgreSQL server-side room authorization)
    socket.on(EVENTS.client.conversationJoin, (data, cb) => handleConversationJoin(io, socket, data, cb));
    socket.on(EVENTS.client.conversationLeave, (data, cb) => handleConversationLeave(io, socket, data, cb));

    // Message sending handler (INSERT into DB FIRST, THEN broadcast message:new)
    socket.on(EVENTS.client.messageSend, (data, cb) => handleMessageSend(io, socket, data, cb));

    // Typing indicators handlers
    socket.on(EVENTS.client.typingStart, (data) => handleTypingStart(io, socket, data));
    socket.on(EVENTS.client.typingStop, (data) => handleTypingStop(io, socket, data));

    // User presence offline on disconnect
    socket.on('disconnect', () => {
      handleUserDisconnected(io, socket);
    });
  });

  return io;
};

