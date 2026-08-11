import * as conversationsRepo from '../../modules/conversations/conversations.repository.js';
import { EVENTS } from '../events.js';

/**
 * Helper to verify whether a socket user is authorized for a conversation.
 */
const isUserAuthorizedForConversation = async (socket, conversationId) => {
  const roomName = `conversation:${conversationId}`;
  if (socket.rooms && socket.rooms.has(roomName)) {
    return true;
  }

  const conversation = await conversationsRepo.findConversationById(conversationId);
  if (!conversation) return false;

  const userId = Number(socket.user?.id);
  return conversation.client_id === userId || conversation.agent_id === userId;
};

/**
 * Handles typing:start event.
 * Broadcasts typing:update { conversationId, senderId, isTyping: true } to room (excluding sender).
 */
export const handleTypingStart = async (io, socket, data) => {
  const conversationId = parseInt(data?.conversationId, 10);
  if (isNaN(conversationId) || conversationId <= 0) return;

  const isAuthorized = await isUserAuthorizedForConversation(socket, conversationId);
  if (!isAuthorized) return;

  const roomName = `conversation:${conversationId}`;
  socket.to(roomName).emit(EVENTS.server.typingUpdate, {
    conversationId,
    senderId: socket.user.id,
    isTyping: true,
  });
};

/**
 * Handles typing:stop event.
 * Broadcasts typing:update { conversationId, senderId, isTyping: false } to room (excluding sender).
 */
export const handleTypingStop = async (io, socket, data) => {
  const conversationId = parseInt(data?.conversationId, 10);
  if (isNaN(conversationId) || conversationId <= 0) return;

  const isAuthorized = await isUserAuthorizedForConversation(socket, conversationId);
  if (!isAuthorized) return;

  const roomName = `conversation:${conversationId}`;
  socket.to(roomName).emit(EVENTS.server.typingUpdate, {
    conversationId,
    senderId: socket.user.id,
    isTyping: false,
  });
};

