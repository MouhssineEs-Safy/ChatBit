import { verifyToken } from '../utils/jwt.js';
import { HttpError } from '../utils/httpError.js';

/**
 * REST JWT Authentication Middleware.
 * Reads Authorization header (Bearer <token>), verifies JWT, and attaches user info to req.user.
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authentication token is required', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpError(401, 'Authentication token is required', 'UNAUTHORIZED');
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      fullname: decoded.fullname,
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new HttpError(401, 'Invalid or expired authentication token', 'UNAUTHORIZED'));
    }
    next(error);
  }
};

/**
 * Role-based authorization middleware factory.
 *
 * @param {...string} allowedRoles - List of allowed roles ('client', 'agent')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Authentication is required', 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, 'Forbidden: insufficient permissions', 'FORBIDDEN'));
    }

    next();
  };
};
