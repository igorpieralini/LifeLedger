-- V2: Goals and sub-goals
-- Goals are annual. They can be broken into monthly/weekly sub-goals.
-- Progress is stored as a percentage (0–100) updated by the service layer.

CREATE TYPE goal_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED');
CREATE TYPE goal_period AS ENUM ('ANNUAL', 'MONTHLY', 'WEEKLY');

CREATE TABLE goals (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200)        NOT NULL,
    description     TEXT,
    year            SMALLINT            NOT NULL,
    target_value    NUMERIC(15, 2),     -- optional numeric target (e.g. km to run)
    current_value   NUMERIC(15, 2)      NOT NULL DEFAULT 0,
    progress        SMALLINT            NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    status          goal_status         NOT NULL DEFAULT 'IN_PROGRESS',
    deadline        DATE,
    created_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE sub_goals (
    id              BIGSERIAL PRIMARY KEY,
    goal_id         BIGINT              NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id         BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200)        NOT NULL,
    description     TEXT,
    period          goal_period         NOT NULL,
    reference_date  DATE                NOT NULL,   -- first day of week/month for ordering
    target_value    NUMERIC(15, 2),
    current_value   NUMERIC(15, 2)      NOT NULL DEFAULT 0,
    progress        SMALLINT            NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    status          goal_status         NOT NULL DEFAULT 'IN_PROGRESS',
    created_at      TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id    ON goals     (user_id, year);
CREATE INDEX idx_sub_goals_goal   ON sub_goals (goal_id);
CREATE INDEX idx_sub_goals_user   ON sub_goals (user_id);
