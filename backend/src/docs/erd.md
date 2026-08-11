# ChatBit — ERD

```mermaid
erDiagram

    USERS ||--o{ CONVERSATIONS : "client"
    USERS ||--o{ CONVERSATIONS : "agent"
    USERS ||--o{ MESSAGES : "sender"
    CONVERSATIONS ||--o{ MESSAGES : "contains"

    USERS {
        int id PK
        varchar full_name
        varchar email UK
        varchar password_hash
        varchar role
        boolean is_online
        timestamp created_at
    }

    CONVERSATIONS {
        int id PK
        varchar subject
        varchar status
        int client_id FK
        int agent_id FK
        timestamp created_at
        timestamp closed_at
    }

    MESSAGES {
        int id PK
        int conversation_id FK
        int sender_id FK
        text content
        boolean is_read
        timestamp sent_at
    }