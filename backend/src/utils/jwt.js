import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Signs a JWT token with the given payload.
 *
 * @param {object} payload - Data to encode in token (e.g. id, role, email)
 * @returns {string} Signed JWT string
 */
export const signToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Verifies and decodes a JWT token.
 *
 * @param {string} token - JWT token string
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
