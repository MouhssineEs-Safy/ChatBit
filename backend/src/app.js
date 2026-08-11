import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import conversationsRoutes from './modules/conversations/conversations.routes.js';
import messagesRoutes from './modules/messages/messages.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

// Mount API routes
app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', conversationsRoutes);
app.use('/api', messagesRoutes);


// Central error handler
app.use(errorMiddleware);

export default app;
