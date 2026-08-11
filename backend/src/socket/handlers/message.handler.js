import * as messagesRepo from '../../modules/messages/messages.repository.js';
import * as conversationsRepo from '../../modules/conversations/conversations.repository.js';
import { EVENTS } from '../events.js';

/**
 * Handles message:send event.
 * Requirement:
 * 1. Validate inputs and user identity from JWT (socket.user).
 * 2. Verify conversation access & status (reject if closed).
 * 3. INSERT message into PostgreSQL DB using parameterized SQL.
 * 4. BROADCAST message:new to room 'conversation:<id>' AFTER successful insert.
 */
export const handleMessageSend = async (io, socket, data, callback) => {
  try {
    const conversationId = parseInt(data?.conversationId, 10);
    const content = typeof data?.content === 'string' ? data.content.trim() : '';

    if (isNaN(conversationId) || conversationId <= 0) {
      const err = { message: 'Invalid conversationId', code: 'VALIDATION_ERROR' };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    if (!content) {
      const err = { message: 'Message content cannot be empty', code: 'VALIDATION_ERROR' };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    // 1. Fetch conversation to verify existence and authorization
    const conversation = await conversationsRepo.findConversationById(conversationId);
    if (!conversation) {
      const err = { message: 'Conversation not found', code: 'NOT_FOUND' };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    // 2. Authorization check
    const userId = Number(socket.user?.id);
    const isClient = conversation.client_id === userId;
    const isAssignedAgent = conversation.agent_id === userId;

    if (!isClient && !isAssignedAgent) {
      const err = { message: 'Unauthorized: You are not a member of this conversation', code: 'FORBIDDEN' };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    // 3. Status check: closed conversations reject new messages
    if (conversation.status === 'fermee') {
      const err = { message: 'Cannot send message to a closed conversation', code: 'CONVERSATION_CLOSED' };
      socket.emit(EVENTS.server.error, err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
      return;
    }

    // 4. Save to PostgreSQL FIRST
    const message = await messagesRepo.insertMessage(conversationId, userId, content);

    // 5. Broadcast message:new to room AFTER successful database insertion
    const roomName = `conversation:${conversationId}`;
    io.to(roomName).emit(EVENTS.server.messageNew, message);

    if (typeof callback === 'function') {
      callback({ success: true, data: message });
    }
  } catch (error) {
    console.error('Error handling message:send:', error);
    socket.emit(EVENTS.server.error, { message: 'Server error sending message' });
    if (typeof callback === 'function') callback({ success: false, error: 'Server error' });
  }
};

