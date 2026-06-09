const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'finflow_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'finflow_secret',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // We can integrate @finflow/logger here later if needed
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = {
  sequelize,
  Sequelize
};
