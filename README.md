<p align="center">
  <img src="./prensinaple cover.png" alt="ChatBit — Real-Time Customer Support Platform" width="560" />
</p>

<h1 align="center">ChatBit — Real-Time Customer Support Platform</h1>

<p align="center">
  <em>Real-time customer support chat, WhatsApp-style — for Souq Express.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

## 1. General Information

**Project:** ChatBit
**Type:** Full Stack Real-Time Customer Support Platform
**Duration:** 4 Days
**Platform:** Mobile Application
**Client:** Souq Express
**Work Format:** Pair Programming

**Core Challenge:** Real-Time Communication with WebSocket / Socket.IO

---

## 2. Context

Souq Express currently manages customer support through phone and email. This creates slow response times, poor communication, and no centralized real-time conversation history.

**ChatBit** is a mobile customer support application similar to WhatsApp, allowing clients and support agents to communicate instantly.

---

## 3. Objectives

* Build a real-time customer support system.
* Understand HTTP vs WebSocket communication.
* Implement secure JWT authentication.
* Persist messages in PostgreSQL.
* Implement real-time messaging.
* Implement conversation management.
* Implement typing indicators.
* Implement online/offline presence.
* Use Socket.IO rooms and events.
* Combine REST API with WebSocket communication.
* Model the system before development.

---

## 4. Users

### Client

The client can:

* Register and login.
* Create a conversation.
* Add a conversation subject.
* Send and receive messages.
* View conversation history.
* See typing status.
* See online/offline presence.

### Agent

The agent can:

* Register and login.
* View pending conversations.
* View conversations in progress.
* Join conversations.
* Send and receive messages.
* Close conversations.

---

## 5. Conversation Status

```text
en_attente → en_cours → closed
```

A new conversation starts as `en_attente`.

When an agent joins, it becomes `en_cours`.

When the agent closes it, the conversation becomes `closed`.

A client cannot send messages after closure.

---

## 6. Authentication

* Registration.
* Login.
* bcrypt password hashing.
* JWT authentication.
* JWT authentication for Socket.IO.

The server determines the authenticated user from the JWT.

**Never trust a `userId` provided by the client.**

---

## 7. Real-Time Chat

ChatBit uses both REST and Socket.IO.

```text
REST API
   ↓
Authentication
Conversations
Message History
CRUD Operations

Socket.IO
   ↓
New Messages
Typing
Presence
Real-Time Updates
```

### Important Rule

```text
Receive message
      ↓
Validate
      ↓
Save to PostgreSQL
      ↓
Broadcast through Socket.IO
```

The message must be saved **before** broadcasting it.

---

## 8. REST API

| Method | Endpoint                          | Access |
| ------ | --------------------------------- | ------ |
| POST   | `/api/auth/register`              | Public |
| POST   | `/api/auth/login`                 | Public |
| GET    | `/api/users/me`                   | JWT    |
| GET    | `/api/conversations`              | JWT    |
| POST   | `/api/conversations`              | Client |
| GET    | `/api/conversations/:id/messages` | JWT    |
| PATCH  | `/api/conversations/:id/close`    | Agent  |

Message history must support pagination.

API documentation must be available through **Scalar UI** at:

```text
/docs
```

---

## 9. WebSocket Events

### Client → Server

* `conversation:join`
* `conversation:leave`
* `message:send`
* `typing:start`
* `typing:stop`

### Server → Client

* `message:new`
* `typing:update`
* `presence:update`
* `conversation:updated`
* `error`

---

## 10. Socket.IO Rules

* Socket connections require a valid JWT..
* Each conversation uses a Socket.IO room.
* Users can only join authorized conversations.
* Only the conversation client or assigned agent can join.
* Closed conversations reject new messages.
* The server is always the final authority.

---

## 11. Database

**Database:** PostgreSQL
**Driver:** `pg`
**ORM:** None

### Users

* `id`
* `full_name`
* `email`
* `password_hash`
* `role`
* `is_online`
* `created_at`

### Conversations

* `id`
* `subject`
* `status`
* `client_id`
* `agent_id`
* `created_at`
* `closed_at`

### Messages

* `id`
* `conversation_id`
* `sender_id`
* `content`
* `is_read`
* `sent_at`

The repository must contain:

```text
schema.sql
```

All SQL queries must use parameterized queries.

---

## 12. Technology Stack

### 📱 Mobile

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=for-the-badge&logo=expo&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![socket.io-client](https://img.shields.io/badge/socket.io--client-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

### ⚙️ Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

### 🗄️ Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![pg](https://img.shields.io/badge/node--postgres_(pg)-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Parameterized SQL](https://img.shields.io/badge/Parameterized_SQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

### 🔐 Security

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-525252?style=for-the-badge&logo=letsencrypt&logoColor=white)

### 📖 Documentation

![Scalar UI](https://img.shields.io/badge/Scalar_UI-1A1A1A?style=for-the-badge&logo=readthedocs&logoColor=white)
![Mermaid](https://img.shields.io/badge/Mermaid-FF3670?style=for-the-badge&logo=mermaid&logoColor=white)

### 🛠️ Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## 13. Repository Structure

The project is organized as a **monorepo** with two apps (`backend/` + `mobile/`) and shared docs.

```text
ChatBit/
├── backend/                        # Node.js + Express + Socket.IO API
│   ├── src/
│   │   ├── app.js                  # Express app: CORS, JSON, routes, Scalar docs, error handler
│   │   ├── server.js               # HTTP + Socket.IO bootstrap, DB connection
│   │   ├── config/
│   │   │   └── db.js               # PostgreSQL connection (pg)
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js  # Verifies JWT, attaches req.user
│   │   │   └── error.middleware.js # Central error handler (HttpError → JSON)
│   │   ├── modules/                # Feature modules (routes → controller → service → repository)
│   │   │   ├── auth/               #   register / login, bcrypt, JWT
│   │   │   ├── users/              #   GET /api/users/me
│   │   │   ├── conversations/      #   create / list / close conversations
│   │   │   └── messages/           #   message history (paginated)
│   │   ├── socket/                 # Real-time layer
│   │   │   ├── index.js            #   Socket.IO server setup
│   │   │   ├── socket.auth.js      #   JWT auth for sockets
│   │   │   ├── events.js           #   Event name constants
│   │   │   └── handlers/           #   message / conversation / typing / presence
│   │   ├── controllers/            # Shared controllers (health)
│   │   ├── routes/                 # Shared routes (health)
│   │   ├── docs/                   # OpenAPI definition (Scalar)
│   │   └── utils/                  # jwt.js, password.js (bcrypt), httpError.js
│   └── package.json
│
├── mobile/                         # React Native + Expo (Expo Router, TypeScript)
│   ├── app/                        # File-based routing
│   │   ├── (auth)/                 #   login / register
│   │   ├── (app)/                  #   conversations list, chat [id], profile
│   │   └── _layout.tsx, index.tsx
│   ├── src/
│   │   ├── api/                    # REST clients (auth, conversations, messages)
│   │   ├── socket/                 # Socket.IO client + event constants
│   │   ├── context/                # AuthContext (current user)
│   │   ├── hooks/                  # useAuth, useConversations, useMessages, useSocket
│   │   ├── components/             # MessageBubble, MessageInput, TypingIndicator, PresenceBadge…
│   │   ├── store/                  # TanStack Query client
│   │   ├── types/                  # Shared TypeScript types
│   │   └── utils/                  # storage (expo-secure-store)
│   └── package.json
│
├── docs/                           # ARCHITECTURE.md, class-diagram.md, ClassDiagram.pdf
├── schema.sql
├── README.md
└── .gitignore
```

### Backend module pattern

Every feature module (`auth`, `users`, `conversations`, `messages`) follows the same 4-file layout, separating HTTP handling, business rules, and data access:

| File               | Responsibility                                             |
| ------------------ | ---------------------------------------------------------- |
| `*.routes.js`      | Maps HTTP method + URL → controller function               |
| `*.controller.js`  | Reads the request, calls the service, returns the response |
| `*.service.js`     | Business rules & validation (the decision layer)           |
| `*.repository.js`  | Parameterized SQL queries against PostgreSQL               |

**Request flow (REST):**

```text
Mobile → routes → controller → service (rules) → repository → PostgreSQL
Mobile ←───────────────── response ←───────────────────────────┘
```

---

## 14. Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) 18+ (LTS)
* [Docker](https://www.docker.com/) (for the PostgreSQL database)
* [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone <repo-url>
cd ChatBit
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable        | Description                         | Example                    |
| --------------- | ----------------------------------- | -------------------------- |
| `PORT`          | Port the API server listens on      | `3000`                     |
| `DB_HOST`       | PostgreSQL host                     | `localhost`                |
| `DB_PORT`       | PostgreSQL port                     | `5433`                     |
| `DB_USER`       | Database user                       | `chatbit`                  |
| `DB_PASSWORD`   | Database password                   | `2026`                     |
| `DB_NAME`       | Database name                       | `chatbit`                  |
| `JWT_SECRET`    | Secret used to sign JWTs            | `change_me_super_secret`   |
| `JWT_EXPIRES_IN`| Token lifetime                      | `7d`                       |

### 4. Start the PostgreSQL database (Docker)

```bash
docker run -d --name chatbit-db \
  -e POSTGRES_USER=chatbit \
  -e POSTGRES_PASSWORD=2026 \
  -e POSTGRES_DB=chatbit \
  -p 5433:5432 \
  -v chatbit_data:/var/lib/postgresql/data \
  postgres:16-alpine
```

Manage the container later with:

```bash
docker start chatbit-db   # start
docker stop chatbit-db    # stop
```

### 5. Load the database schema

```bash
docker exec -i chatbit-db psql -U chatbit -d chatbit < src/db/schema.sql
```

### 6. Run the backend

```bash
npm run dev
```

You should see:

```text
✅ DB connectée
✅ Tables synchronisées
🚀 http://localhost:3000
```

### 7. Verify

* Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health) → `{ "status": "ok" }`
* API docs (Scalar): [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 15. Available Scripts

Run from the `backend/` directory.

| Script             | Command                        | Description                                             |
| ------------------ | ------------------------------ | ------------------------------------------------------- |
| `npm run dev`      | `node --watch src/server.js`   | Start the API in development with auto-reload on changes |
| `npm start`        | `node src/server.js`           | Start the API in production mode                        |
| `npm run db:schema`| `psql "$DATABASE_URL" -f src/db/schema.sql` | Apply the database schema (requires `DATABASE_URL`) |
| `npm run db:seed`  | `psql "$DATABASE_URL" -f src/db/seed.sql`   | Seed the database with sample data (requires `DATABASE_URL`) |

> **Note:** `db:schema` / `db:seed` use a `DATABASE_URL` environment variable. When running Postgres in Docker, you can either set `DATABASE_URL=postgresql://chatbit:2026@localhost:5433/chatbit` or use the `docker exec` command shown in step 5.

---

## 16. UML & Modeling

Before coding, the following diagrams must be created:

* Use Case Diagram
* Class Diagram
* ERD
* Sequence Diagram
* State Diagram

Mermaid diagrams will also be included in the README.

---

## 17. Development Plan

### Day 1

* Understand requirements.
* Create GitHub repository.
* Create README.
* Create UML diagrams.
* Create ERD.
* Create database schema.
* Initialize backend.
* Initialize Expo mobile project.

### Day 2

* PostgreSQL connection.
* Authentication.
* JWT.
* REST API.
* Conversation management.
* Scalar documentation.
* Socket authentication.

### Day 3

* Socket.IO rooms.
* Real-time messaging.
* Message persistence.
* Typing indicators.
* Presence.
* Mobile chat interface.
* TanStack Query integration.

### Day 4

* Client/Agent integration.
* Testing.
* Error handling.
* Documentation.
* Git cleanup.
* Two-device demonstration.
* Final presentation.

---

## 18. Deliverables

* GitHub monorepo.
* Backend.
* Mobile application.
* PostgreSQL database.
* `schema.sql`.
* `.env.example`.
* REST API.
* Scalar documentation.
* Socket.IO real-time system.
* UML diagrams.
* ERD.
* Sequence Diagram.
* State Diagram.
* README.
* Clean Git history.

---

## 19. Expected Result

At the end of the project, ChatBit must allow a **Client** and an **Agent** to communicate through a secure real-time mobile chat.

The application must demonstrate:

```text
Client
   ↓
Expo Mobile App
   ↓
REST + Socket.IO
   ↓
Node.js / Express
   ↓
PostgreSQL
```

The main goal is not only to make ChatBit work, but to understand **why each technology exists and how the complete system communicates**.

> **The client proposes. The server decides.**
