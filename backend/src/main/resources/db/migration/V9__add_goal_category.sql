-- V9: add category, icon, and color columns to goals
ALTER TABLE goals ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT 'CAREER';
ALTER TABLE goals ADD COLUMN icon     VARCHAR(60);
ALTER TABLE goals ADD COLUMN color    VARCHAR(20);

-- migrate existing financial goals
UPDATE goals SET category = 'FINANCE' WHERE is_financial = TRUE;

CREATE INDEX idx_goals_category ON goals (user_id, category);
