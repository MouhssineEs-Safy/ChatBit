import { query } from '../../config/db.js';

/**
 * Retrieves paginated messages for a conversation in chronological order (sent_at ASC, id ASC).
 * Parameterized SQL only.
 *
 * @param {number} conversationId - Conversation ID
 * @param {number} limit - Max number of messages to return
 * @param {number} offset - Number of messages to skip
 * @returns {Promise<Array<object>>} List of messages
 */
export const listByConversation = async (conversationId, limit, offset) => {
  const sql = `
    SELECT 
      m.id,
      m.conversationid AS conversation_id,
      m.senderid AS sender_id,
      m.content,
      m.isread AS is_read,
      m.sentat AS sent_at,
      u.fullname AS sender_name,
      u.role AS sender_role
    FROM messages m
    JOIN users u ON m.senderid = u.id
    WHERE m.conversationid = $1
    ORDER BY m.sentat ASC, m.id ASC
    LIMIT $2 OFFSET $3;
  `;
  const result = await query(sql, [conversationId, limit, offset]);
  return result.rows;
};

/**
 * Counts total messages in a conversation.
 * Parameterized SQL only.
 *
 * @param {number} conversationId - Conversation ID
 * @returns {Promise<number>} Total count of messages
 */
export const countByConversation = async (conversationId) => {
  const sql = `
    SELECT COUNT(*)::int AS total
    FROM messages
    WHERE conversationid = $1;
  `;
  const result = await query(sql, [conversationId]);
  return result.rows[0]?.total || 0;
};
