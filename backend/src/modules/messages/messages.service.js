import { query } from '../../config/db.js';
import * as messagesRepository from './messages.repository.js';

async function loadConversation(conversationId) {
  const result = await query(
    `SELECT id, clientid, agentid, status
     FROM conversations
     WHERE id = $1`,
    [conversationId]
  );
  return result.rows[0];
}

export async function createMessage(user, conversationId, content) {
  const conversation = await loadConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const userId = Number(user?.id);
  if (!userId) {
    throw new Error('Unauthorized');
  }

  if (conversation.clientid !== userId && conversation.agentid !== userId) {
    throw new Error('Unauthorized');
  }

  if (conversation.status === 'fermee') {
    throw new Error('Cannot send messages to a closed conversation');
  }

  return messagesRepository.insertMessage(conversationId, userId, content);
}

export async function getHistory(user, conversationId) {
  const conversation = await loadConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const userId = Number(user?.id);
  if (!userId) {
    throw new Error('Unauthorized');
  }

  if (conversation.clientid !== userId && conversation.agentid !== userId) {
    throw new Error('Unauthorized');
  }

  return messagesRepository.listByConversation(conversationId);
}
