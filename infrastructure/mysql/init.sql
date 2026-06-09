-- Initialization script for MySQL
-- Creating the database and initial users table if required by Phase 1.
-- Sequelize migrations will handle most schema updates.

CREATE DATABASE IF NOT EXISTS finflow_db;

USE finflow_db;

-- We let Sequelize handle the actual table creation,
-- but creating a placeholder table to verify initialization works.
CREATE TABLE IF NOT EXISTS _init_check (
    id INT AUTO_INCREMENT PRIMARY KEY,
    initialized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO _init_check () VALUES ();
