-- V1: Users table
-- Authentication and profile data are kept in a single table for simplicity.
-- Passwords are stored as BCrypt hashes — never plain text.

CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
