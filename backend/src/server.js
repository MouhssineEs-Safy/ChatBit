import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './socket/index.js';
import { requireAuth } from './middlewares/auth.middleware.js';
import { getHistory } from './modules/messages/messages.service.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ChatBit API is running' });
});

app.get('/api/conversations/:conversationId/messages', requireAuth, async (req, res) => {
  const conversationId = Number(req.params.conversationId);
  if (!conversationId || conversationId <= 0) {
    return res.status(400).json({ error: 'conversationId must be a positive integer' });
  }

  try {
    const messages = await getHistory(req.user, conversationId);
    return res.json({ data: messages });
  } catch (error) {
    if (error.message === 'Conversation not found') {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message });
    }

    console.error('Failed to fetch conversation messages:', error);
    return res.status(500).json({ error: 'Unable to fetch messages' });
  }
});

const server = createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`ChatBit API running on port ${PORT}`);
});
