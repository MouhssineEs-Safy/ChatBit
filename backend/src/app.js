import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import conversationsRoutes from './modules/conversations/conversations.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

// Mount API routes
app.use('/api', healthRoutes);
app.use('/api', conversationsRoutes);

// Central error handler
app.use(errorMiddleware);

export default app;
