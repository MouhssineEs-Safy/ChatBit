export const EVENTS = {
  client: {
    conversationJoin: 'conversation:join',
    conversationLeave: 'conversation:leave',
    messageSend: 'message:send',
    typingStart: 'typing:start',
    typingStop: 'typing:stop',
  },
  server: {
    messageNew: 'message:new',
    typingUpdate: 'typing:update',
    presenceUpdate: 'presence:update',
    conversationUpdated: 'conversation:updated',
    error: 'error',
  },
};
