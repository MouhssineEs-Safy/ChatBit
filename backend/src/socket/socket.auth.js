import { verifyToken } from '../utils/jwt.js';

export function socketAuthMiddleware(socket, next) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const payload = verifyToken(token);
    socket.user = payload;
    next();
  } catch (error) {
    next(new Error('Invalid authentication token'));
  }
}
