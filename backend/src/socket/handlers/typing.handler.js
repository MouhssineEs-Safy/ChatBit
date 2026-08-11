import { EVENTS } from '../events.js';

const TYPING_TIMEOUT_MS = 5000;
const ROOM_PREFIX = 'conversation:';

function buildRoom(conversationId) {
  return `${ROOM_PREFIX}${conversationId}`;
}

function buildTimerKey(conversationId) {
  return String(conversationId);
}

function clearTypingTimer(socket, conversationId) {
  if (!(socket._typingTimers instanceof Map)) {
    socket._typingTimers = new Map();
  }

  const key = buildTimerKey(conversationId);
  const timer = socket._typingTimers.get(key);
  if (timer) {
    clearTimeout(timer);
    socket._typingTimers.delete(key);
  }
}

function broadcastTypingUpdate(socket, conversationId, isTyping) {
  const room = buildRoom(conversationId);
  socket.to(room).emit(EVENTS.server.typingUpdate, {
    conversationId,
    senderId: socket.user?.id,
    isTyping,
  });
}

export function clearTypingState(socket, conversationId) {
  if (!conversationId || conversationId <= 0) {
    return;
  }

  clearTypingTimer(socket, conversationId);
  broadcastTypingUpdate(socket, conversationId, false);
}

export function handleTypingStart(io, socket, data) {
  const conversationId = Number(data?.conversationId);
  if (!conversationId || conversationId <= 0) {
    return socket.emit(EVENTS.server.error, {
      message: 'conversationId is required',
    });
  }

  clearTypingTimer(socket, conversationId);
  broadcastTypingUpdate(socket, conversationId, true);

  const timeoutId = setTimeout(() => {
    clearTypingTimer(socket, conversationId);
    broadcastTypingUpdate(socket, conversationId, false);
  }, TYPING_TIMEOUT_MS);

  socket._typingTimers.set(buildTimerKey(conversationId), timeoutId);
}

export function handleTypingStop(io, socket, data) {
  const conversationId = Number(data?.conversationId);
  if (!conversationId || conversationId <= 0) {
    return socket.emit(EVENTS.server.error, {
      message: 'conversationId is required',
    });
  }

  clearTypingState(socket, conversationId);
}
