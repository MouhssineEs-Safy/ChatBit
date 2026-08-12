import { query } from "../../config/db.js";

/**
 * Loads the fields needed for room access control.
 *
 * @param {number|string} conversationId
 * @returns {Promise<{id:number, subject:string, status:string, clientid:number, agentid:number|null} | null>}
 */
export async function findConversationById(conversationId) {
  const result = await query(
    `SELECT id, subject, status, clientid, agentid, createdat, closedat
     FROM conversations
     WHERE id = $1`,
    [conversationId]
  );
  return result.rows[0] || null;
}

/**
 * Claims an unassigned (en_attente) conversation for an agent and moves it to
 * en_cours. The `status = 'en_attente'` guard makes this safe against two
 * agents racing to join the same pending conversation — only the first wins.
 *
 * @param {number|string} conversationId
 * @param {number|string} agentId
 * @returns {Promise<object|null>} The updated conversation, or null if it was
 *   no longer en_attente (already claimed).
 */
export async function assignAgentAndStart(conversationId, agentId) {
  const result = await query(
    `UPDATE conversations
     SET agentid = $2, status = 'en_cours'
     WHERE id = $1 AND status = 'en_attente'
     RETURNING id, subject, status, clientid, agentid, createdat, closedat`,
    [conversationId, agentId]
  );
  return result.rows[0] || null;
}
