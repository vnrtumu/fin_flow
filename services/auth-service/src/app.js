const express = require('express');
const logger = require('@finflow/logger');
const { errorHandler } = require('@finflow/middleware');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());

app.use('/', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});
