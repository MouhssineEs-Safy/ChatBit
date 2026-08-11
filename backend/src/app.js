import express from 'express';
import cors from 'cors';
import { apiReference } from '@scalar/express-api-reference';
import { config } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import conversationsRoutes from './modules/conversations/conversations.routes.js';
import messagesRoutes from './modules/messages/messages.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

// Mount API routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', conversationsRoutes);
app.use('/api', messagesRoutes);

// API documentation (Scalar UI)
app.use(
  '/docs',
  apiReference({
    content: {
      openapi: '3.1.0',
      info: { title: 'ChatBit API', version: '1.0.0' },
      paths: {},
    },
  }),
);

// Central error handler — MUST be last
app.use(errorMiddleware);

export default app;
