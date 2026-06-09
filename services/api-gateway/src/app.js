const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('@finflow/logger');
const { requireAuth } = require('@finflow/middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const app = express();

app.use(helmet());
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinFlow API',
      version: '1.0.0',
      description: 'API Documentation for FinFlow microservices',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'API Gateway',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '../../auth-service/src/routes/*.js'),
    path.resolve(__dirname, '../../user-service/src/routes/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth Service Proxy (Public route)
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  logLevel: 'silent', // Silences the [HPM] terminal logs
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Auth service is starting up. Please try again in a moment.' });
  }
}));

// User Service Proxy (Protected route, verifies JWT first)
app.use('/api/users', requireAuth, createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  logLevel: 'silent', // Silences the [HPM] terminal logs
  onError: (err, req, res) => {
    res.status(503).json({ error: 'User service is starting up. Please try again in a moment.' });
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
