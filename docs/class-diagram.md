classDiagram

    class User {
        +int id
        +string full_name
        +string email
        +string password_hash
        +Role role
        +boolean is_online
        +datetime created_at
        +register()
        +login()
        +updatePresence()
    }

    class Conversation {
        +int id
        +string subject
        +ConversationStatus status
        +int client_id
        +int agent_id
        +datetime created_at
        +datetime closed_at
        +create()
        +join()
        +close()
    }

    class Message {
        +int id
        +int conversation_id
        +int sender_id
        +string content
        +boolean is_read
        +datetime sent_at
        +send()
        +markAsRead()
    }

    class Role {
        <<enumeration>>
        client
        agent
    }

    class ConversationStatus {
        <<enumeration>>
        en_attente
        en_cours
        closed
    }

    User "1" --> "0..*" Conversation : client
    User "1" --> "0..*" Conversation : agent
    Conversation "1" --> "0..*" Message : contains
    User "1" --> "0..*" Message : sender

    User --> Role : role
    Conversation --> ConversationStatus : status
