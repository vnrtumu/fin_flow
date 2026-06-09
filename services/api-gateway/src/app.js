const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('@finflow/logger');
const { requireAuth } = require('@finflow/middleware');

const app = express();

app.use(helmet());
app.use(cors());

// Auth Service Proxy (Public route)
app.use('/api/auth', createProxyMiddleware({ 
  target: 'http://localhost:3001', 
  changeOrigin: true 
}));

// User Service Proxy (Protected route, verifies JWT first)
app.use('/api/users', requireAuth, createProxyMiddleware({ 
  target: 'http://localhost:3002', 
  changeOrigin: true 
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
