import { query } from "../../config/db.js";

export async function findByEmail(email) {
  const result = await query(
    `SELECT id, fullname, email, passwordhash, role FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

export async function createUser({ fullname, email, passwordhash, role }) {
  const result = await query(
    `INSERT INTO users (fullname, email, passwordhash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, fullname, email, role, createdat`,
    [fullname, email, passwordhash, role]
  );
  return result.rows[0];
}
