CREATE TABLE finance_records (
    id                  BIGSERIAL PRIMARY KEY,
    year                SMALLINT       NOT NULL,
    month               SMALLINT       NOT NULL CHECK (month BETWEEN 1 AND 12),
    monthly_income      NUMERIC(12, 2) NOT NULL DEFAULT 0,
    monthly_investment  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    credit_card_limit   NUMERIC(12, 2) NOT NULL DEFAULT 0,
    debit_card_limit    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at          TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP      NOT NULL DEFAULT NOW(),
    UNIQUE (year, month)
);
