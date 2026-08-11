import { verifyToken } from '../utils/jwt.js';

/**
 * Socket.IO authentication middleware.
 * Verifies JWT token from handshake.auth.token or Authorization header.
 * Attaches verified user payload to socket.user.
 * NEVER trusts any client-provided userId.
 */
export const socketAuthMiddleware = (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers?.authorization) {
      const authHeader = socket.handshake.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return next(new Error('Invalid token payload'));
    }

    // Attach authenticated identity from server-validated JWT ONLY
    socket.user = {
      id: Number(decoded.id),
      role: decoded.role,
      email: decoded.email,
      fullname: decoded.fullname,
    };

    next();
  } catch (error) {
    return next(new Error('Invalid or expired authentication token'));
  }
};

