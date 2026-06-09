const express = require('express');
const logger = require('@finflow/logger');
const { errorHandler } = require('@finflow/middleware');
const userRoutes = require('./routes/user.routes');
const { sequelize } = require('@finflow/database');

const app = express();
app.use(express.json());

app.use('/', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3002;

// In a real scenario we might sync the DB models here before listening
sequelize.authenticate()
  .then(() => logger.info('User Service connected to MySQL'))
  .catch(err => logger.error('Unable to connect to MySQL:', err));

app.listen(PORT, () => {
  logger.info(`User Service running on port ${PORT}`);
});
