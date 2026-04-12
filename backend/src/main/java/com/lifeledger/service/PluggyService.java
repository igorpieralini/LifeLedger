package com.lifeledger.service;

import com.lifeledger.dto.response.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

@Service
public class PluggyService {

    private static final Logger log = LoggerFactory.getLogger(PluggyService.class);

    private final PluggyClient pluggyClient;
    private final AtomicReference<String> currentItemId = new AtomicReference<>();
    private final AtomicReference<String> currentAccountId = new AtomicReference<>();

    public PluggyService(PluggyClient pluggyClient) {
        this.pluggyClient = pluggyClient;
    }

    public PluggyItemResponse connectAccount(String user, String password) {
        PluggyItemResponse item = pluggyClient.createItem(user, password);
        currentItemId.set(item.id());

        PluggyItemResponse ready = waitUntilReady(item.id());

        PluggyAccountsResponse accounts = pluggyClient.getAccounts(ready.id());
        if (accounts.results() != null && !accounts.results().isEmpty()) {
            currentAccountId.set(accounts.results().get(0).id());
        }

        return ready;
    }

    public PluggyItemResponse connectOpenFinance(int connectorId, String cpf) {
        PluggyItemResponse item = pluggyClient.createOpenFinanceItem(connectorId, cpf);
        currentItemId.set(item.id());
        return item;
    }

    public PluggyAccountResponse getBalance() {
        String itemId = requireItemId();
        PluggyAccountsResponse accounts = pluggyClient.getAccounts(itemId);

        if (accounts.results() == null || accounts.results().isEmpty()) {
            throw new IllegalStateException("No accounts found for itemId=" + itemId);
        }

        PluggyAccountResponse account = accounts.results().get(0);
        currentAccountId.set(account.id());
        return account;
    }

    public PluggyTransactionsResponse getTransactions() {
        return pluggyClient.getTransactions(requireAccountId());
    }

    private PluggyItemResponse waitUntilReady(String itemId) {
        int maxAttempts = 10;
        int delayMs = 3000;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            PluggyItemResponse current = pluggyClient.getItem(itemId);
            log.info("[Pluggy] Polling attempt={} status={}", attempt, current.status());

            if (!"UPDATING".equalsIgnoreCase(current.status())) {
                return current;
            }

            if (attempt < maxAttempts) {
                try { Thread.sleep(delayMs); } catch (InterruptedException e) { Thread.currentThread().interrupt(); break; }
            }
        }

        return pluggyClient.getItem(itemId);
    }

    private String requireItemId() {
        String id = currentItemId.get();
        if (id == null) {
            throw new IllegalStateException("No item connected. Call POST /pluggy/connect-account first.");
        }
        return id;
    }

    private String requireAccountId() {
        String id = currentAccountId.get();
        if (id == null) {
            throw new IllegalStateException("No account available. Call POST /pluggy/connect-account first.");
        }
        return id;
    }
}
