import * as conversationsRepo from './conversations.repository.js';
import { HttpError } from '../../utils/httpError.js';

/**
 * Creates a new conversation for an authenticated client.
 *
 * @param {object} user - Authenticated user object ({ id, role, ... })
 * @param {object} input - Input data ({ subject })
 * @returns {Promise<object>} Created conversation
 */
export const createConversation = async (user, { subject }) => {
  if (user.role !== 'client') {
    throw new HttpError(403, 'Only clients can create conversations', 'FORBIDDEN');
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    throw new HttpError(400, 'Conversation subject is required', 'VALIDATION_ERROR');
  }

  if (subject.trim().length > 200) {
    throw new HttpError(400, 'Conversation subject cannot exceed 200 characters', 'VALIDATION_ERROR');
  }

  const createdConversation = await conversationsRepo.createConversation(
    user.id,
    subject.trim()
  );

  return createdConversation;
};

/**
 * Lists conversations accessible by the authenticated user based on role.
 *
 * @param {object} user - Authenticated user object ({ id, role, ... })
 * @returns {Promise<Array<object>>} List of conversations
 */
export const listConversations = async (user) => {
  if (user.role === 'client') {
    return conversationsRepo.listConversationsForClient(user.id);
  }

  if (user.role === 'agent') {
    return conversationsRepo.listConversationsForAgent(user.id);
  }

  throw new HttpError(403, 'Forbidden: unrecognized user role', 'FORBIDDEN');
};
