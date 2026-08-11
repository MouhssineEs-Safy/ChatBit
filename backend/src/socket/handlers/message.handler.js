import { createMessage } from '../../modules/messages/messages.service.js';
import { EVENTS } from '../events.js';

export async function handleMessageSend(io, socket, data) {
  const conversationId = Number(data?.conversationId);
  const content = String(data?.content ?? '').trim();

  if (!conversationId || conversationId <= 0) {
    return socket.emit(EVENTS.server.error, {
      message: 'conversationId is required',
    });
  }

  if (!content) {
    return socket.emit(EVENTS.server.error, {
      message: 'Message content cannot be empty',
    });
  }

  if (content.length > 1000) {
    return socket.emit(EVENTS.server.error, {
      message: 'Message content is too long',
    });
  }

  try {
    const message = await createMessage(socket.user, conversationId, content);
    const room = `conversation:${conversationId}`;
    io.to(room).emit(EVENTS.server.messageNew, message);
  } catch (error) {
    socket.emit(EVENTS.server.error, {
      message: error?.message || 'Unable to send message',
    });
  }
}
