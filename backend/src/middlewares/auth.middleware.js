// REST JWT guard. Reads Authorization: Bearer <token>, verifies, attaches req.user.
// Variants: requireAuth, requireRole('agent'), requireRole('client').
