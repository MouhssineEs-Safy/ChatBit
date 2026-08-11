import { query } from '../../config/db.js';

export async function insertMessage(conversationId, senderId, content) {
  const result = await query(
    `INSERT INTO messages (conversationid, senderid, content)
     VALUES ($1, $2, $3)
     RETURNING id, conversationid, senderid, content, isread, sentat`,
    [conversationId, senderId, content]
  );

  return result.rows[0];
}

export async function listByConversation(conversationId) {
  const result = await query(
    `SELECT id, conversationid, senderid, content, isread, sentat
     FROM messages
     WHERE conversationid = $1
     ORDER BY sentat ASC`,
    [conversationId]
  );

  return result.rows;
}
