import { query } from '../../config/db.js';

/**
 * Finds a user by ID.
 * Parameterized SQL query ($1).
 *
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
export const findUserById = async (userId) => {
  const sql = `
    SELECT id, fullname, email, role, isonline AS is_online, createdat AS created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await query(sql, [userId]);
  return result.rows[0] || null;
};

/**
 * Updates a user's online status.
 * Parameterized SQL query ($1, $2).
 *
 * @param {number} userId
 * @param {boolean} isOnline
 * @returns {Promise<object|null>}
 */
export const setUserOnline = async (userId, isOnline) => {
  const sql = `
    UPDATE users
    SET isonline = $2
    WHERE id = $1
    RETURNING id, fullname, email, role, isonline AS is_online;
  `;
  const result = await query(sql, [userId, isOnline]);
  return result.rows[0] || null;
};

