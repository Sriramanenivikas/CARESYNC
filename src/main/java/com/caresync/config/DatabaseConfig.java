package com.caresync.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Database configuration for Render.com deployment.
 * Handles conversion of DATABASE_URL from postgres:// to jdbc:postgresql:// format.
 */
@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource dataSource() throws URISyntaxException {
        if (databaseUrl == null || databaseUrl.isEmpty()) {
            throw new IllegalStateException("DATABASE_URL environment variable is not set");
        }

        // Handle both postgres:// and postgresql:// schemes
        String urlToParse = databaseUrl;
        if (urlToParse.startsWith("postgres://")) {
            urlToParse = urlToParse.replace("postgres://", "postgresql://");
        }

        URI dbUri = new URI(urlToParse);

        String userInfo = dbUri.getUserInfo();
        if (userInfo == null || !userInfo.contains(":")) {
            throw new IllegalStateException("DATABASE_URL must contain username and password");
        }

        String username = userInfo.split(":")[0];
        String password = userInfo.split(":")[1];

        // Handle port - use 5432 as default if not specified
        int port = dbUri.getPort();
        if (port == -1) {
            port = 5432;
        }

        String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + port + dbUri.getPath();

        // Handle query parameters (e.g., sslmode)
        if (dbUri.getQuery() != null) {
            jdbcUrl += "?" + dbUri.getQuery();
        } else {
            // Add SSL requirement for Render
            jdbcUrl += "?sslmode=require";
        }

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMinimumIdle(2);
        dataSource.setMaximumPoolSize(10);
        dataSource.setIdleTimeout(30000);
        dataSource.setConnectionTimeout(20000);
        dataSource.setMaxLifetime(1800000);
        dataSource.setDriverClassName("org.postgresql.Driver");

        return dataSource;
    }
}

