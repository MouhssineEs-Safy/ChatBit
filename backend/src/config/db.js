import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

/**
 * Parameterized SQL query executor.
 * Ensures parameterized queries only ($1, $2, etc.) to prevent SQL injection.
 *
 * @param {string} text - SQL query with parameter placeholders
 * @param {Array} [params] - Values array matching parameter placeholders
 * @returns {Promise<pg.QueryResult>}
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Verifies PostgreSQL database connectivity at startup.
 */
export const verifyDbConnection = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW() AS current_time');
    console.log('PostgreSQL connection verified successfully. DB time:', res.rows[0].current_time);
  } finally {
    client.release();
  }
};
