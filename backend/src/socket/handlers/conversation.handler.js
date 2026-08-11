import * as conversationsRepo from '../../modules/conversations/conversations.repository.js';
import { EVENTS } from '../events.js';

/**
 * Handles conversation:join event.
 * Performs server-side authorization check against PostgreSQL.
 * User may join ONLY if they are the conversation client OR the assigned agent.
 */
export const handleConversationJoin = async (io, socket, data, callback) => {
  try {
    const conversationId = parseInt(data?.conversationId, 10);
    if (isNaN(conversationId) || conversationId <= 0) {
      const err = { message: 'Invalid or missing conversationId', code: 'VALIDATION_ERROR' };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    // 1. Fetch conversation record from PostgreSQL using parameterized SQL
    const conversation = await conversationsRepo.findConversationById(conversationId);
    if (!conversation) {
      const err = { message: 'Conversation not found', code: 'NOT_FOUND' };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    // 2. Server-side authorization check using JWT-authenticated user identity
    const userId = Number(socket.user?.id);
    const isClient = conversation.client_id === userId;
    const isAssignedAgent = conversation.agent_id === userId;

    if (!isClient && !isAssignedAgent) {
      const err = {
        message: 'Unauthorized: You are not authorized to join this conversation room',
        code: 'FORBIDDEN',
      };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    // 3. User is authorized -> join Socket.IO room
    const roomName = `conversation:${conversationId}`;
    socket.join(roomName);

    socket.emit('conversation:joined', { conversationId });

    if (typeof callback === 'function') {
      callback({ success: true, conversationId });
    }
  } catch (error) {
    console.error('Error handling conversation:join:', error);
    socket.emit(EVENTS.server.error, { message: 'Server error joining conversation' });
    if (typeof callback === 'function') {
      callback({ success: false, error: 'Server error' });
    }
  }
};

/**
 * Handles conversation:leave event.
 */
export const handleConversationLeave = (io, socket, data, callback) => {
  const conversationId = parseInt(data?.conversationId, 10);
  if (!isNaN(conversationId) && conversationId > 0) {
    const roomName = `conversation:${conversationId}`;
    socket.leave(roomName);
    socket.emit('conversation:left', { conversationId });
    if (typeof callback === 'function') {
      callback({ success: true, conversationId });
    }
  }
};

