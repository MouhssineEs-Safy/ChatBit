import * as usersRepo from './users.repository.js';
import { HttpError } from '../../utils/httpError.js';

export const getMe = async (userId) => {
  const user = await usersRepo.findUserById(userId);
  if (!user) {
    throw new HttpError(404, 'User not found', 'NOT_FOUND');
  }
  return user;
};

export const setPresence = async (userId, isOnline) => {
  return await usersRepo.setUserOnline(userId, isOnline);
};
