import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import * as usersController from './users.controller.js';

const router = Router();

router.get('/users/me', requireAuth, usersController.getMe);

export default router;

