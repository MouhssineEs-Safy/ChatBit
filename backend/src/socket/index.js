import { Server } from 'socket.io';
import { socketAuthMiddleware } from './socket.auth.js';
import { handleConversationJoin, handleConversationLeave } from './handlers/conversation.handler.js';
import { handleMessageSend } from './handlers/message.handler.js';
import { handleTypingStart, handleTypingStop, clearTypingState } from './handlers/typing.handler.js';
import { EVENTS } from './events.js';

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    socket._typingTimers = new Map();

    socket.on(EVENTS.client.conversationJoin, (data) => {
      handleConversationJoin(io, socket, data);
    });

    socket.on(EVENTS.client.conversationLeave, (data) => {
      handleConversationLeave(io, socket, data);
    });

    socket.on(EVENTS.client.messageSend, async (data) => {
      if (data && data.conversationId) {
        clearTypingState(socket, data.conversationId);
      }

      try {
        await handleMessageSend(io, socket, data);
      } catch (error) {
        socket.emit(EVENTS.server.error, {
          message: error?.message || 'Unable to send message',
        });
      }
    });

    socket.on(EVENTS.client.typingStart, (data) => {
      handleTypingStart(io, socket, data);
    });

    socket.on(EVENTS.client.typingStop, (data) => {
      handleTypingStop(io, socket, data);
    });
  });
}
