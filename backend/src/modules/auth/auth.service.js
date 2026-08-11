import * as authRepo from './auth.repository.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';
import { HttpError } from '../../utils/httpError.js';

export const register = async ({ fullname, email, password, role = 'client' }) => {
  if (!fullname || !email || !password) {
    throw new HttpError(400, 'Full name, email, and password are required', 'VALIDATION_ERROR');
  }

  const existingUser = await authRepo.findUserByEmail(email.toLowerCase().trim());
  if (existingUser) {
    throw new HttpError(409, 'User with this email already exists', 'CONFLICT');
  }

  const userRole = role === 'agent' ? 'agent' : 'client';
  const hashedPassword = await hashPassword(password);
  const user = await authRepo.createUser(fullname.trim(), email.toLowerCase().trim(), hashedPassword, userRole);

  const token = signToken({
    id: user.id,
    role: user.role,
    email: user.email,
    fullname: user.fullname,
  });

  return { user, token };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required', 'VALIDATION_ERROR');
  }

  const user = await authRepo.findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new HttpError(401, 'Invalid credentials', 'UNAUTHORIZED');
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new HttpError(401, 'Invalid credentials', 'UNAUTHORIZED');
  }

  const token = signToken({
    id: user.id,
    role: user.role,
    email: user.email,
    fullname: user.fullname,
  });

  const { password_hash, ...cleanUser } = user;
  return { user: cleanUser, token };
};

