import { query } from '../../config/db.js';

/**
 * Finds a user by email.
 * Parameterized SQL ($1).
 *
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export const findUserByEmail = async (email) => {
  const sql = `
    SELECT id, fullname, email, passwordhash AS password_hash, role, isonline AS is_online, createdat AS created_at
    FROM users
    WHERE email = $1;
  `;
  const result = await query(sql, [email]);
  return result.rows[0] || null;
};

/**
 * Creates a new user.
 * Parameterized SQL ($1, $2, $3, $4).
 *
 * @param {string} fullname
 * @param {string} email
 * @param {string} passwordHash
 * @param {string} role - 'client' or 'agent'
 * @returns {Promise<object>} Created user record
 */
export const createUser = async (fullname, email, passwordHash, role = 'client') => {
  const sql = `
    INSERT INTO users (fullname, email, passwordhash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, fullname, email, role, isonline AS is_online, createdat AS created_at;
  `;
  const result = await query(sql, [fullname, email, passwordHash, role]);
  return result.rows[0];
};

