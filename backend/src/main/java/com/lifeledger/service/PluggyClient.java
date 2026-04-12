package com.lifeledger.service;

import com.lifeledger.config.PluggyProperties;
import com.lifeledger.dto.response.*;
import com.lifeledger.dto.request.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

/**
 * PluggyClient — low-level HTTP adapter for the Pluggy REST API.
 *
 * Responsibilities:
 *  - Authenticate with Pluggy (POST /auth) and cache the API key in memory.
 *  - Create a sandbox item / connect account (POST /items).
 *  - Fetch accounts (GET /accounts?itemId=...).
 *  - Fetch transactions (GET /transactions?accountId=...).
 *
 * The cached API key is stored in an AtomicReference so it is thread-safe for
 * a single-user MVP without a distributed cache.
 */
@Component
public class PluggyClient {

    private static final Logger log = LoggerFactory.getLogger(PluggyClient.class);

    private final RestTemplate restTemplate;
    private final PluggyProperties props;

    /** In-memory token cache — fine for a single-server MVP. */
    private final AtomicReference<String> cachedApiKey = new AtomicReference<>();

    public PluggyClient(RestTemplateBuilder builder, PluggyProperties props) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(30))
                .build();
        this.props = props;
        // Seed the cache from application.yml / env-var if a key was pre-configured.
        // This avoids the POST /auth round-trip for as long as the key is valid.
        if (props.getApiKey() != null && !props.getApiKey().isBlank()) {
            cachedApiKey.set(props.getApiKey());
            log.info("[Pluggy] Pre-configured API key loaded from properties");
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Auth
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Returns a valid API key, fetching a new one from Pluggy if not cached.
     * Pluggy API keys expire after a short window; for production, add expiry
     * tracking. For the sandbox MVP this eager re-use is sufficient.
     */
    public String getApiKey() {
        String key = cachedApiKey.get();
        if (key != null) {
            return key;
        }
        return refreshApiKey();
    }

    /** Forces a new token fetch and updates the cache. */
    public String refreshApiKey() {
        log.info("[Pluggy] Requesting new API key");

        Map<String, String> body = Map.of(
                "clientId", props.getClientId(),
                "clientSecret", props.getClientSecret()
        );

        ResponseEntity<PluggyAuthResponse> response = restTemplate.postForEntity(
                props.getBaseUrl() + "/auth",
                new HttpEntity<>(body, jsonHeaders(null)),
                PluggyAuthResponse.class
        );

        String apiKey = requireBody(response).apiKey();
        cachedApiKey.set(apiKey);
        log.info("[Pluggy] API key obtained successfully");
        return apiKey;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Items (bank connections)
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Creates an Item (bank connection) using the sandbox connector.
     * Pluggy connector 0 accepts user="user-ok" / password="password-ok".
     */
    public PluggyItemResponse createItem(String user, String password) {
        log.info("[Pluggy] Creating item — connectorId={}", props.getSandboxConnectorId());

        Map<String, Object> body = Map.of(
                "connectorId", props.getSandboxConnectorId(),
                "parameters", Map.of(
                        "user", user,
                        "password", password
                )
        );

        try {
            ResponseEntity<PluggyItemResponse> response = restTemplate.postForEntity(
                    props.getBaseUrl() + "/items",
                    new HttpEntity<>(body, jsonHeaders(getApiKey())),
                    PluggyItemResponse.class
            );
            PluggyItemResponse item = requireBody(response);
            log.info("[Pluggy] Item created — id={} status={}", item.id(), item.status());
            return item;
        } catch (HttpClientErrorException.Unauthorized e) {
            log.warn("[Pluggy] API key expired, retrying with fresh key");
            cachedApiKey.set(null);
            ResponseEntity<PluggyItemResponse> response = restTemplate.postForEntity(
                    props.getBaseUrl() + "/items",
                    new HttpEntity<>(body, jsonHeaders(refreshApiKey())),
                    PluggyItemResponse.class
            );
            return requireBody(response);
        }
    }

    /**
     * Creates an Open Finance Item (connector ID >= 600, e.g. 601 = Itaú PF).
     * Requires a CPF (Personal) or CNPJ (Business).
     * The response contains an `oauthUrl` that the user must open in the browser
     * to authorize access on the bank's own login page.
     */
    public PluggyItemResponse createOpenFinanceItem(int connectorId, String cpf) {
        log.info("[Pluggy] Creating Open Finance item — connectorId={}", connectorId);

        Map<String, Object> body = Map.of(
                "connectorId", connectorId,
                "parameters", Map.of("cpf", cpf)
        );

        ResponseEntity<PluggyItemResponse> response = restTemplate.postForEntity(
                props.getBaseUrl() + "/items",
                new HttpEntity<>(body, jsonHeaders(getApiKey())),
                PluggyItemResponse.class
        );
        PluggyItemResponse item = requireBody(response);
        log.info("[Pluggy] OF Item created — id={} oauthUrl={}", item.id(), item.oauthUrl());
        return item;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Item status polling
    // ──────────────────────────────────────────────────────────────────────────

    /** Returns the current state of an Item (used to poll for UPDATED status). */
    public PluggyItemResponse getItem(String itemId) {
        ResponseEntity<PluggyItemResponse> response = restTemplate.exchange(
                props.getBaseUrl() + "/items/" + itemId,
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(getApiKey())),
                PluggyItemResponse.class
        );
        return requireBody(response);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Accounts
    // ──────────────────────────────────────────────────────────────────────────

    /** Returns all accounts linked to the given itemId. */
    public PluggyAccountsResponse getAccounts(String itemId) {
        log.info("[Pluggy] Fetching accounts — itemId={}", itemId);
        String url = props.getBaseUrl() + "/accounts?itemId=" + itemId;

        ResponseEntity<PluggyAccountsResponse> response = restTemplate.exchange(
                url, HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(getApiKey())),
                PluggyAccountsResponse.class
        );
        PluggyAccountsResponse accounts = requireBody(response);
        log.info("[Pluggy] Accounts fetched — total={}", accounts.total());
        return accounts;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Transactions
    // ──────────────────────────────────────────────────────────────────────────

    /** Returns the transaction history for the given accountId. */
    public PluggyTransactionsResponse getTransactions(String accountId) {
        log.info("[Pluggy] Fetching transactions — accountId={}", accountId);
        String url = props.getBaseUrl() + "/transactions?accountId=" + accountId;

        ResponseEntity<PluggyTransactionsResponse> response = restTemplate.exchange(
                url, HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(getApiKey())),
                PluggyTransactionsResponse.class
        );
        PluggyTransactionsResponse txns = requireBody(response);
        log.info("[Pluggy] Transactions fetched — total={}", txns.total());
        return txns;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────

    private HttpHeaders jsonHeaders(String apiKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (apiKey != null) {
            headers.set("X-API-KEY", apiKey);
        }
        return headers;
    }

    private <T> T requireBody(ResponseEntity<T> response) {
        T body = response.getBody();
        if (body == null) {
            throw new IllegalStateException("Pluggy API returned an empty response body");
        }
        return body;
    }
}
