import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
      contact: {
        name: 'Your Name',
      },
      servers: ['http://localhost:3001'],
    },
    paths: {
      '/': {
        get: {
          summary: 'Returns a greeting message',
          responses: {
            '200': {
              description: 'A successful response',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string',
                    example: 'Hello World!',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./**/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
