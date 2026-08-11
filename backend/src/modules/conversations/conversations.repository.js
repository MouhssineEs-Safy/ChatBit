import { query } from '../../config/db.js';

/**
 * Creates a new conversation with initial status 'en_attente'.
 * Parameterized SQL only.
 *
 * @param {number} clientId - ID of the creating client
 * @param {string} subject - Conversation subject
 * @returns {Promise<object>} Created conversation record
 */
export const createConversation = async (clientId, subject) => {
  const sql = `
    INSERT INTO conversations (subject, status, clientid)
    VALUES ($1, 'en_attente', $2)
    RETURNING 
      id,
      subject,
      status,
      clientid AS client_id,
      agentid AS agent_id,
      createdat AS created_at,
      closedat AS closed_at;
  `;
  const result = await query(sql, [subject, clientId]);
  return result.rows[0];
};

/**
 * Lists conversations belonging to a specific client.
 * Parameterized SQL only.
 *
 * @param {number} clientId - ID of the client
 * @returns {Promise<Array<object>>} List of conversations
 */
export const listConversationsForClient = async (clientId) => {
  const sql = `
    SELECT 
      c.id,
      c.subject,
      c.status,
      c.clientid AS client_id,
      c.agentid AS agent_id,
      c.createdat AS created_at,
      c.closedat AS closed_at,
      u_client.fullname AS client_name,
      u_agent.fullname AS agent_name
    FROM conversations c
    LEFT JOIN users u_client ON c.clientid = u_client.id
    LEFT JOIN users u_agent ON c.agentid = u_agent.id
    WHERE c.clientid = $1
    ORDER BY c.createdat DESC;
  `;
  const result = await query(sql, [clientId]);
  return result.rows;
};

/**
 * Lists conversations visible to an agent (pending OR assigned to this agent).
 * Parameterized SQL only.
 *
 * @param {number} agentId - ID of the agent
 * @returns {Promise<Array<object>>} List of conversations
 */
export const listConversationsForAgent = async (agentId) => {
  const sql = `
    SELECT 
      c.id,
      c.subject,
      c.status,
      c.clientid AS client_id,
      c.agentid AS agent_id,
      c.createdat AS created_at,
      c.closedat AS closed_at,
      u_client.fullname AS client_name,
      u_agent.fullname AS agent_name
    FROM conversations c
    LEFT JOIN users u_client ON c.clientid = u_client.id
    LEFT JOIN users u_agent ON c.agentid = u_agent.id
    WHERE c.status = 'en_attente' OR c.agentid = $1
    ORDER BY c.createdat DESC;
  `;
  const result = await query(sql, [agentId]);
  return result.rows;
};

/**
 * Finds a conversation by ID.
 * Parameterized SQL only.
 *
 * @param {number} conversationId
 * @returns {Promise<object|null>}
 */
export const findConversationById = async (conversationId) => {
  const sql = `
    SELECT 
      c.id,
      c.subject,
      c.status,
      c.clientid AS client_id,
      c.agentid AS agent_id,
      c.createdat AS created_at,
      c.closedat AS closed_at
    FROM conversations c
    WHERE c.id = $1;
  `;
  const result = await query(sql, [conversationId]);
  return result.rows[0] || null;
};
