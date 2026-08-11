import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import * as messagesController from './messages.controller.js';

const router = Router();

// GET /api/conversations/:id/messages (JWT required, paginated, chronological)
router.get('/conversations/:id/messages', requireAuth, messagesController.getHistory);

export default router;
