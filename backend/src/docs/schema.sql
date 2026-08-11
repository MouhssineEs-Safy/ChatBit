-- ============================================================
-- ChatBit — Database schema (PostgreSQL)
-- Deliverable: schema.sql
-- Run: psql "$DATABASE_URL" -f src/db/schema.sql
-- ============================================================

BEGIN;

-- Clean slate (dev only) --------------------------------------
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE  IF EXISTS user_role;
DROP TYPE  IF EXISTS conversation_status;

-- Enums -------------------------------------------------------
CREATE TYPE user_role           AS ENUM ('client', 'agent');
CREATE TYPE conversation_status AS ENUM ('en_attente', 'en_cours', 'fermee');

-- Users -------------------------------------------------------
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  fullname      VARCHAR(120)  NOT NULL,
  email         VARCHAR(160)  NOT NULL UNIQUE,
  passwordhash  VARCHAR(255)  NOT NULL,
  role          user_role     NOT NULL DEFAULT 'client',
  isonline      BOOLEAN       NOT NULL DEFAULT FALSE,
  createdat     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Conversations -----------------------------------------------
CREATE TABLE conversations (
  id         SERIAL PRIMARY KEY,
  subject    VARCHAR(200)         NOT NULL,
  status     conversation_status  NOT NULL DEFAULT 'en_attente',
  clientid   INTEGER              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agentid    INTEGER                       REFERENCES users(id) ON DELETE SET NULL,
  createdat  TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  closedat   TIMESTAMPTZ
);

-- Messages ----------------------------------------------------
CREATE TABLE messages (
  id              SERIAL PRIMARY KEY,
  conversationid  INTEGER      NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  senderid        INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT         NOT NULL,
  isread          BOOLEAN      NOT NULL DEFAULT FALSE,
  sentat          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes (performance for listing + pagination) --------------
CREATE INDEX idx_conversations_clientid ON conversations(clientid);
CREATE INDEX idx_conversations_agentid  ON conversations(agentid);
CREATE INDEX idx_conversations_status   ON conversations(status);
CREATE INDEX idx_messages_conversation  ON messages(conversationid, sentat DESC);

COMMIT;
