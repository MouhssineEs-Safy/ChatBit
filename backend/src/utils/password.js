import bcrypt from 'bcrypt';
import { config } from '../config/env.js';

/**
 * Hashes a plaintext password using bcrypt.
 *
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} Password hash
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, config.bcryptRounds);
};

/**
 * Compares a plaintext password with a hash.
 *
 * @param {string} password - Plaintext password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Match result
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

