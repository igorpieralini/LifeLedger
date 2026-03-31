-- V3: Financial control — categories and transactions

CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE category_type    AS ENUM ('FIXED', 'VARIABLE');

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100)    NOT NULL,
    type        category_type   NOT NULL DEFAULT 'VARIABLE',
    color       VARCHAR(7),     -- hex color for UI (e.g. #FF5733)
    icon        VARCHAR(50),    -- icon name/code for UI
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id     BIGINT              REFERENCES categories(id) ON DELETE SET NULL,
    type            transaction_type    NOT NULL,
    amount          NUMERIC(15, 2)      NOT NULL CHECK (amount > 0),
    description     VARCHAR(255)        NOT NULL,
    date            DATE                NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- Seed default categories (system-level, user_id = 0 is a convention)
-- Real user-specific categories are created via the API.

CREATE INDEX idx_categories_user    ON categories  (user_id);
CREATE INDEX idx_transactions_user  ON transactions (user_id, date DESC);
CREATE INDEX idx_transactions_cat   ON transactions (category_id);
