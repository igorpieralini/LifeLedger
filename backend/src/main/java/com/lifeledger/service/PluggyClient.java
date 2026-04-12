package com.lifeledger.service;

import com.lifeledger.config.PluggyProperties;
import com.lifeledger.dto.response.*;
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

@Component
public class PluggyClient {

    private static final Logger log = LoggerFactory.getLogger(PluggyClient.class);

    private final RestTemplate restTemplate;
    private final PluggyProperties props;
    private final AtomicReference<String> cachedApiKey = new AtomicReference<>();

    public PluggyClient(RestTemplateBuilder builder, PluggyProperties props) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(30))
                .build();
        this.props = props;
        if (props.getApiKey() != null && !props.getApiKey().isBlank()) {
            cachedApiKey.set(props.getApiKey());
            log.info("[Pluggy] API key loaded from properties");
        }
    }

    public String getApiKey() {
        String key = cachedApiKey.get();
        return key != null ? key : refreshApiKey();
    }

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
        log.info("[Pluggy] API key obtained");
        return apiKey;
    }

    public PluggyItemResponse createItem(String user, String password) {
        log.info("[Pluggy] Creating item connectorId={}", props.getSandboxConnectorId());
        Map<String, Object> body = Map.of(
                "connectorId", props.getSandboxConnectorId(),
                "parameters", Map.of("user", user, "password", password)
        );
        try {
            PluggyItemResponse item = requireBody(restTemplate.postForEntity(
                    props.getBaseUrl() + "/items",
                    new HttpEntity<>(body, jsonHeaders(getApiKey())),
                    PluggyItemResponse.class
            ));
            log.info("[Pluggy] Item created id={} status={}", item.id(), item.status());
            return item;
        } catch (HttpClientErrorException.Unauthorized e) {
            log.warn("[Pluggy] API key expired, retrying");
            cachedApiKey.set(null);
            return requireBody(restTemplate.postForEntity(
                    props.getBaseUrl() + "/items",
                    new HttpEntity<>(body, jsonHeaders(refreshApiKey())),
                    PluggyItemResponse.class
            ));
        }
    }

    public PluggyItemResponse createOpenFinanceItem(int connectorId, String cpf) {
        log.info("[Pluggy] Creating OF item connectorId={}", connectorId);
        Map<String, Object> body = Map.of(
                "connectorId", connectorId,
                "parameters", Map.of("cpf", cpf)
        );
        PluggyItemResponse item = requireBody(restTemplate.postForEntity(
                props.getBaseUrl() + "/items",
                new HttpEntity<>(body, jsonHeaders(getApiKey())),
                PluggyItemResponse.class
        ));
        log.info("[Pluggy] OF Item created id={} oauthUrl={}", item.id(), item.oauthUrl());
        return item;
    }

    public PluggyItemResponse getItem(String itemId) {
        return requireBody(restTemplate.exchange(
                props.getBaseUrl() + "/items/" + itemId,
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(getApiKey())),
                PluggyItemResponse.class
        ));
    }

    public PluggyAccountsResponse getAccounts(String itemId) {
        log.info("[Pluggy] Fetching accounts itemId={}", itemId);
        PluggyAccountsResponse accounts = requireBody(restTemplate.exchange(
                props.getBaseUrl() + "/accounts?itemId=" + itemId,
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(getApiKey())),
                PluggyAccountsResponse.class
        ));
        log.info("[Pluggy] Accounts fetched total={}", accounts.total());
        return accounts;
    }

    public PluggyTransactionsResponse getTransactions(String accountId) {
        log.info("[Pluggy] Fetching transactions accountId={}", accountId);
        PluggyTransactionsResponse txns = requireBody(restTemplate.exchange(
                props.getBaseUrl() + "/transactions?accountId=" + accountId,
                HttpMethod.GET,
                new HttpEntity<>(jsonHeaders(getApiKey())),
                PluggyTransactionsResponse.class
        ));
        log.info("[Pluggy] Transactions fetched total={}", txns.total());
        return txns;
    }

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
            throw new IllegalStateException("Pluggy API returned empty response");
        }
        return body;
    }
}
