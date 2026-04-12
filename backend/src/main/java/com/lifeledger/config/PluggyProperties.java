package com.lifeledger.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "pluggy")
public class PluggyProperties {

    private String baseUrl = "https://api.pluggy.ai";
    private String clientId;
    private String clientSecret;
    private String apiKey;
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
