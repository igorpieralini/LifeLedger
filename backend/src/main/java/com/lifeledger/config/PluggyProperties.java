package com.lifeledger.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds the {@code pluggy.*} block from application.yml.
 *
 * <p>If {@code pluggy.api-key} is configured it is used directly, skipping the
 * POST /auth call entirely. When it is absent or expires, the client falls back
 * to fetching a new key via {@code clientId} + {@code clientSecret}.</p>
 */
@Component
@ConfigurationProperties(prefix = "pluggy")
public class PluggyProperties {

    private String baseUrl = "https://api.pluggy.ai";
    private String clientId;
    private String clientSecret;
    /** Pre-issued API key (optional). Avoids the /auth round-trip when set. */
    private String apiKey;
    /** Sandbox connector ID for Pluggy's built-in test bank (connector 0). */
    private int sandboxConnectorId = 0;

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public int getSandboxConnectorId() { return sandboxConnectorId; }
    public void setSandboxConnectorId(int sandboxConnectorId) { this.sandboxConnectorId = sandboxConnectorId; }
}
