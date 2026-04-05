-- V7: add explicit goal type (financial or non-financial)
ALTER TABLE goals
    ADD COLUMN is_financial BOOLEAN NOT NULL DEFAULT FALSE;