import swaggerJSDoc from 'swagger-jsdoc';
import { join } from 'path';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ESGIKing API Documentation',
      version: '1.0.0',
      description: 'Documentation for the ESGIKing delivery application API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
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
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './controllers/*.ts',
    './dist/controllers/*.js',
  ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
