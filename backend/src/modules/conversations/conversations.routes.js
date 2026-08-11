import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware.js';
import * as conversationsController from './conversations.controller.js';

const router = Router();

// GET /api/conversations (JWT - client sees own, agent sees pending + assigned)
router.get('/conversations', requireAuth, conversationsController.list);

// POST /api/conversations (Client only - creates conversation with initial status en_attente)
router.post('/conversations', requireAuth, requireRole('client'), conversationsController.create);

export default router;
