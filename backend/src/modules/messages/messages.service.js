import * as messagesRepo from './messages.repository.js';
import * as conversationsRepo from '../conversations/conversations.repository.js';
import { HttpError } from '../../utils/httpError.js';

/**
 * Retrieves paginated message history for an authorized conversation member (client or assigned agent).
 *
 * @param {object} user - Authenticated user object ({ id, role, ... })
 * @param {number|string} rawConversationId - Conversation ID
 * @param {object} [options] - Pagination options ({ limit, offset })
 * @returns {Promise<{ messages: Array, pagination: object }>}
 */
export const getHistory = async (user, rawConversationId, { limit = 20, offset = 0 } = {}) => {
  const conversationId = parseInt(rawConversationId, 10);
  if (isNaN(conversationId) || conversationId <= 0) {
    throw new HttpError(400, 'Invalid conversation ID', 'VALIDATION_ERROR');
  }

  // Parse and validate pagination parameters
  let parsedLimit = parseInt(limit, 10);
  let parsedOffset = parseInt(offset, 10);

  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    parsedLimit = 20;
  }
  if (parsedLimit > 100) {
    parsedLimit = 100;
  }

  if (isNaN(parsedOffset) || parsedOffset < 0) {
    parsedOffset = 0;
  }

  // 1. Fetch conversation to verify existence
  const conversation = await conversationsRepo.findConversationById(conversationId);
  if (!conversation) {
    throw new HttpError(404, 'Conversation not found', 'NOT_FOUND');
  }

  // 2. Authorization check: User must be the conversation client OR assigned agent
  const isClient = conversation.client_id === user.id;
  const isAssignedAgent = conversation.agent_id === user.id;

  if (!isClient && !isAssignedAgent) {
    throw new HttpError(403, 'Forbidden: you do not have access to this conversation', 'FORBIDDEN');
  }

  // 3. Fetch paginated messages in chronological order and total message count
  const [messages, totalCount] = await Promise.all([
    messagesRepo.listByConversation(conversationId, parsedLimit, parsedOffset),
    messagesRepo.countByConversation(conversationId),
  ]);

  const hasMore = parsedOffset + messages.length < totalCount;

  return {
    messages,
    pagination: {
      limit: parsedLimit,
      offset: parsedOffset,
      count: messages.length,
      total: totalCount,
      has_more: hasMore,
    },
  };
};
