import { EVENTS } from '../events.js';

export function handleConversationJoin(io, socket, data) {
  const conversationId = Number(data?.conversationId);
  if (!conversationId || conversationId <= 0) {
    return socket.emit(EVENTS.server.error, {
      message: 'conversationId is required to join',
    });
  }

  const room = `conversation:${conversationId}`;
  socket.join(room);
  socket.emit('conversation:joined', { conversationId });
}

export function handleConversationLeave(io, socket, data) {
  const conversationId = Number(data?.conversationId);
  if (!conversationId || conversationId <= 0) {
    return socket.emit(EVENTS.server.error, {
      message: 'conversationId is required to leave',
    });
  }

  const room = `conversation:${conversationId}`;
  socket.leave(room);
  socket.emit('conversation:left', { conversationId });
}
