
import sequelize from "../../config/db.js";
import { QueryTypes } from "sequelize";

export async function findByEmail(email) {
  const rows = await sequelize.query(
    `SELECT id, fullname, email, passwordhash, role FROM users WHERE email = $1`,
    { bind: [email], type: QueryTypes.SELECT }
  );
  return rows[0] || null;   
}

export async function createUser({ fullname, email, passwordhash, role }) {
  const rows = await sequelize.query(
    `INSERT INTO users (fullname, email, passwordhash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, fullname, email, role, createdat`,
    { bind: [fullname, email, passwordhash, role], type: QueryTypes.INSERT }
  );
  return rows[0][0];  
}
