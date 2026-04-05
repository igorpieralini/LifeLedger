-- Create category_limits table to store spending limits per category
CREATE TABLE IF NOT EXISTS category_limits (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE,
    limit_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default limits from the previous YAML configuration
INSERT INTO category_limits (category_name, limit_amount) VALUES
    ('Moradia', 2500),
    ('Alimentacao', 1200),
    ('Transporte', 700),
    ('Lazer', 500),
    ('Saude', 600),
    ('Educacao', 450),
    ('Roupas', 300),
    ('Fatura do cartao', 1800),
    ('Boletos', 900),
    ('Taxas Bancarias', 200),
    ('Outros itens', 400)
ON CONFLICT (category_name) DO NOTHING;