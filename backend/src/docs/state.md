# ChatBit — Conversation State Diagram

```mermaid
stateDiagram-v2

    [*] --> en_attente : Client creates conversation

    en_attente --> en_cours : Agent joins conversation

    en_cours --> fermee : Agent closes conversation

    fermee --> [*]