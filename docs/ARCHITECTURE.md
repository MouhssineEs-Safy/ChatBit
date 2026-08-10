# ChatBit — Architecture

Mono-repo: `/backend` (Node/Express + Socket.IO + PostgreSQL) and `/mobile` (Expo Router).

```
ChatBit/
├── backend/
│   ├── src/
│   │   ├── config/        env validation + pg pool
│   │   ├── db/            schema.sql (deliverable) + seed.sql
│   │   ├── middlewares/   REST JWT guard + error handler
│   │   ├── modules/       feature-based (routes → controller → service → repository)
│   │   │   ├── auth/          register / login (bcrypt + JWT)
│   │   │   ├── users/         GET /me, presence
│   │   │   ├── conversations/ create / list / close
│   │   │   └── messages/      REST history (pagination)
│   │   ├── socket/        Socket.IO server
│   │   │   ├── socket.auth.js  io.use JWT middleware
│   │   │   ├── events.js       named event constants
│   │   │   └── handlers/       conversation / message / typing / presence
│   │   ├── docs/          OpenAPI spec → Scalar UI at /docs
│   │   ├── utils/         jwt, password (bcrypt), httpError
│   │   ├── app.js         Express app
│   │   └── server.js      HTTP + Socket.IO bootstrap
│   └── .env.example
│
├── mobile/
│   ├── app/               Expo Router (file-based routing)
│   │   ├── (auth)/        login / register
│   │   └── (app)/         conversations (list + chat [id]), profile
│   └── src/
│       ├── api/           axios instance + endpoint calls
│       ├── hooks/         TanStack Query hooks + socket subscription
│       ├── socket/        socket.io-client singleton + event constants
│       ├── context/       AuthContext (token + user)
│       ├── components/    MessageBubble, MessageInput, TypingIndicator, PresenceBadge…
│       ├── store/         QueryClient config
│       ├── types/         shared TS models
│       └── utils/         SecureStore token storage
│
└── docs/                  diagrams + this file
```

## Layered flow (backend)

```
HTTP request → route → controller → service (rules) → repository (parameterized SQL) → PostgreSQL
Socket event → socket.auth (JWT) → handler → service → repository → DB → broadcast to room
```

Each conversation = one Socket.IO room named `conversation:<id>`.

## REST endpoints

| Method | Path                               | Access  |
|--------|------------------------------------|---------|
| POST   | /api/auth/register                 | Public  |
| POST   | /api/auth/login                    | Public  |
| GET    | /api/users/me                      | JWT     |
| GET    | /api/conversations                 | JWT     |
| POST   | /api/conversations                 | Client  |
| GET    | /api/conversations/:id/messages    | JWT     |
| PATCH  | /api/conversations/:id/close       | Agent   |

## WebSocket events

| Direction        | Event                  | Purpose                          |
|------------------|------------------------|----------------------------------|
| Client → Server  | conversation:join      | Join a conversation room         |
| Client → Server  | conversation:leave     | Leave a room                     |
| Client → Server  | message:send           | Send a message                   |
| Client → Server  | typing:start / stop    | Typing signal                    |
| Server → Client  | message:new            | New persisted message            |
| Server → Client  | typing:update          | Someone is typing                |
| Server → Client  | presence:update        | User online/offline              |
| Server → Client  | conversation:updated   | Status change (joined / closed)  |
| Server → Client  | error                  | Rejected action                  |

## Key server rules

1. Socket connection refused without a valid JWT (`io.use`). Never trust a client `userId`.
2. A user only joins rooms where they are the client or the assigned agent.
3. `message:send` on a closed conversation → `error`.
4. Mandatory order: **INSERT into DB before broadcasting**.
