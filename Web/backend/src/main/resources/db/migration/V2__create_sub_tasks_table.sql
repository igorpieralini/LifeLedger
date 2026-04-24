CREATE TABLE sub_tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sub_tasks_goal_id ON sub_tasks(goal_id);
CREATE INDEX idx_sub_tasks_display_order ON sub_tasks(goal_id, display_order);
