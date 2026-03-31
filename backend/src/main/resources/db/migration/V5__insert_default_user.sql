-- V5: Insert default user (id = 1) used when authentication is disabled.
-- Password hash is irrelevant — login is not required.

INSERT INTO users (id, name, email, password)
VALUES (1, 'Usuário', 'user@lifeledger.local', '$2a$10$placeholder.hash.not.used')
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence so future inserts start after id 1
SELECT setval('users_id_seq', GREATEST((SELECT MAX(id) FROM users), 1));
