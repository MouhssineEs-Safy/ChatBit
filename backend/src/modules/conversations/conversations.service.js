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

/**
 * Authorizes a user to join a conversation room and applies the agent-claim
 * rule. A user may join only if they are the conversation's client or the
 * assigned agent; additionally, an agent may pick up an unassigned pending
 * (`en_attente`) conversation, which claims it and moves it to `en_cours`.
 *
 * The client is never trusted for identity — `user` comes from the JWT.
 *
 * @param {object} user - Authenticated user ({ id, role, ... }) from the token.
 * @param {number|string} conversationId
 * @returns {Promise<{conversation: object, updated: object|null}>}
 *   `conversation` is the (possibly updated) row; `updated` is non-null only
 *   when this call transitioned en_attente → en_cours (so callers know to
 *   broadcast `conversation:updated`).
 * @throws {HttpError} 400 invalid id, 404 not found, 403 not authorized.
 */
export const authorizeJoin = async (user, conversationId) => {
  if (conversationId === undefined || conversationId === null || conversationId === '') {
    throw new HttpError(400, 'conversationId is required', 'VALIDATION_ERROR');
  }

  const conversation = await conversationsRepo.findConversationById(conversationId);
  if (!conversation) {
    throw new HttpError(404, 'Conversation not found', 'NOT_FOUND');
  }

  const isClient = user.role === 'client' && conversation.clientid === user.id;
  const isAssignedAgent = user.role === 'agent' && conversation.agentid === user.id;
  const canClaim =
    user.role === 'agent' &&
    conversation.agentid === null &&
    conversation.status === 'en_attente';

  if (!isClient && !isAssignedAgent && !canClaim) {
    throw new HttpError(403, 'You are not allowed to join this conversation', 'FORBIDDEN');
  }

  // Agent picking up a pending conversation → claim it and start it.
  if (canClaim) {
    const updated = await conversationsRepo.assignAgentAndStart(conversationId, user.id);
    // If another agent won the race, `updated` is null; re-fetch to see whether
    // it ended up assigned to us (normal authorized join) or to someone else.
    if (updated) {
      return { conversation: updated, updated };
    }
    const latest = await conversationsRepo.findConversationById(conversationId);
    if (!latest || latest.agentid !== user.id) {
      throw new HttpError(403, 'Conversation was already taken by another agent', 'FORBIDDEN');
    }
    return { conversation: latest, updated: null };
  }

  return { conversation, updated: null };
};
