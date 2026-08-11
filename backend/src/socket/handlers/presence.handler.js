import * as usersRepo from '../../modules/users/users.repository.js';
import { EVENTS } from '../events.js';

export const handleUserConnected = async (io, socket) => {
  try {
    const userId = Number(socket.user?.id);
    if (!userId) return;

    await usersRepo.setUserOnline(userId, true);
    io.emit(EVENTS.server.presenceUpdate, {
      userId,
      isOnline: true,
    });
  } catch (error) {
    console.error('Error in presence handleUserConnected:', error);
  }
};

export const handleUserDisconnected = async (io, socket) => {
  try {
    const userId = Number(socket.user?.id);
    if (!userId) return;

    await usersRepo.setUserOnline(userId, false);
    io.emit(EVENTS.server.presenceUpdate, {
      userId,
      isOnline: false,
    });
  } catch (error) {
    console.error('Error in presence handleUserDisconnected:', error);
  }
};

