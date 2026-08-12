import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,        // 1 database
  process.env.DB_USER,        // 2 username
  process.env.DB_PASSWORD,    // 3 password
  {                          
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5433,
    dialect: "postgres",
    logging: false,
  }
);

// pg-style helper so auth/conversations/messages repositories keep working
export const query = async (text, params = []) => {
  const [rows] = await sequelize.query(text, { bind: params });
  return { rows };
};

export const verifyDbConnection = () => sequelize.authenticate();

export default sequelize;
