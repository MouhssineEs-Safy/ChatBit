// io.use middleware: read JWT from handshake.auth.token, verify, attach socket.user.
// Reject connection if token missing/invalid. NEVER trust a client-sent userId.
