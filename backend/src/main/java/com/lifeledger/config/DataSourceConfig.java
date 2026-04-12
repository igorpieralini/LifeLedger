package com.lifeledger.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@Configuration
@Slf4j
public class DataSourceConfig {

    @Value("${lifeledger.database.host:localhost}")
    private String host;

    @Value("${lifeledger.database.port:5432}")
    private int port;

    @Value("${lifeledger.database.name:lifeledger}")
    private String dbName;

    @Value("${lifeledger.database.username:postgres}")
    private String username;

    @Value("${lifeledger.database.password:postgres}")
    private String password;

    @Value("${lifeledger.database.auto-create:true}")
    private boolean autoCreate;

    @Value("${lifeledger.database.pool.minimum-idle:2}")
    private int minimumIdle;

    @Value("${lifeledger.database.pool.maximum-pool-size:10}")
    private int maxPoolSize;

    @Value("${lifeledger.database.pool.connection-timeout:30000}")
    private long connectionTimeout;

    @Value("${lifeledger.database.pool.idle-timeout:600000}")
    private long idleTimeout;

    @Value("${lifeledger.database.pool.max-lifetime:1800000}")
    private long maxLifetime;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (autoCreate) {
            createDatabaseIfNotExists();
        }
        return buildHikariDataSource();
    }

    private void createDatabaseIfNotExists() {
        String adminUrl = String.format("jdbc:postgresql://%s:%d/postgres", host, port);

        log.info("Checking database '{}' on {}:{}...", dbName, host, port);

        try (Connection conn = DriverManager.getConnection(adminUrl, username, password);
             Statement stmt = conn.createStatement()) {

            ResultSet rs = stmt.executeQuery(
                    "SELECT 1 FROM pg_database WHERE datname = '" + sanitize(dbName) + "'"
            );

            if (!rs.next()) {
                log.info("Database '{}' not found. Creating...", dbName);
                stmt.execute("CREATE DATABASE \"" + sanitize(dbName) + "\"");
                log.info("Database '{}' created successfully.", dbName);
            } else {
                log.debug("Database '{}' already exists.", dbName);
            }

        } catch (Exception e) {
            log.error("Failed to ensure database '{}' exists: {}", dbName, e.getMessage());
            throw new IllegalStateException(
                    "Cannot connect to PostgreSQL at %s:%d. Check if PostgreSQL is running and credentials are correct."
                            .formatted(host, port), e
            );
        }
    }

    private HikariDataSource buildHikariDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName));
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");

        config.setMinimumIdle(minimumIdle);
        config.setMaximumPoolSize(maxPoolSize);
        config.setConnectionTimeout(connectionTimeout);
        config.setIdleTimeout(idleTimeout);
        config.setMaxLifetime(maxLifetime);

        config.setConnectionTestQuery("SELECT 1");
        config.setPoolName("LifeLedger-HikariPool");

        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("useServerPrepStmts", "true");

        log.info("HikariCP pool configured: min={}, max={}", minimumIdle, maxPoolSize);
        return new HikariDataSource(config);
    }

    private String sanitize(String name) {
        if (!name.matches("[a-zA-Z0-9_\\-]+")) {
            throw new IllegalArgumentException("Invalid database name: " + name);
        }
        return name;
    }
}
