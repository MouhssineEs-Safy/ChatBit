import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL, JWT_SECRET, PORT } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export { DATABASE_URL, JWT_SECRET, PORT };
