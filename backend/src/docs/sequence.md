# ChatBit — Sequence Diagram

```mermaid
sequenceDiagram

    participant C as Client
    participant S as Socket.IO Server
    participant DB as PostgreSQL
    participant R as Conversation Room
    participant A as Agent

    C->>S: message:send(conversationId, content)

    S->>S: Verify JWT
    S->>S: Verify conversation access
    S->>S: Verify conversation status

    S->>DB: INSERT message

    DB-->>S: Message created

    S->>R: message:new(message)

    R-->>C: message:new
    R-->>A: message:new