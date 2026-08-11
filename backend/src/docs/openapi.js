// OpenAPI spec object describing all REST endpoints. Served via Scalar UI at /docs.
export default {
  openapi: '3.0.3',
  info: {
    title: 'ChatBit API',
    description: 'REST API for ChatBit real-time customer support application',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3000'
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints'
    },
    {
      name: 'Users',
      description: 'User endpoints'
    },
    {
      name: 'Conversations',
      description: 'Conversation endpoints'
    },
    {
      name: 'Messages',
      description: 'Message endpoints'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {}
};
