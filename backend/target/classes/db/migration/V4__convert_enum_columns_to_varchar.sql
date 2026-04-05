-- V4: Convert PostgreSQL custom enum types to VARCHAR
--
-- Motivation: Hibernate 6 / Spring Boot 3 binds @Enumerated(EnumType.STRING)
-- values as VARCHAR (JDBC type 12). PostgreSQL rejects VARCHAR -> custom-enum
-- assignment without an explicit CAST, causing PSQLException at INSERT/UPDATE time.
-- Using VARCHAR columns avoids this incompatibility entirely; application-level
-- Java enums enforce the allowed values.

ALTER TABLE transactions
    ALTER COLUMN type TYPE VARCHAR(20) USING type::VARCHAR;

ALTER TABLE categories
    ALTER COLUMN type TYPE VARCHAR(20) USING type::VARCHAR;

-- Drop the now-unused PostgreSQL enum types
DROP TYPE IF EXISTS transaction_type;
DROP TYPE IF EXISTS category_type;