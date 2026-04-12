package com.lifeledger.service;

import com.lifeledger.dto.response.*;
import com.lifeledger.dto.request.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

/**
 * PluggyService — business logic layer between the controller and the HTTP client.
 *
 * The service holds the itemId and accountId in memory so that the
 * balance/transaction endpoints can reuse them without the caller needing to
 * pass them explicitly. For a production system these would live in the DB.
 */
@Service
public class PluggyService {

    private static final Logger log = LoggerFactory.getLogger(PluggyService.class);

    private final PluggyClient pluggyClient;

    /** In-memory state — sufficient for a single-user MVP. */
    private final AtomicReference<String> currentItemId    = new AtomicReference<>();
    private final AtomicReference<String> currentAccountId = new AtomicReference<>();

    public PluggyService(PluggyClient pluggyClient) {
        this.pluggyClient = pluggyClient;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Connect
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Connects a sandbox bank account.
     * After connecting, stores the itemId and the first accountId for later use.
     *
     * @return the created Item response
     */
    public PluggyItemResponse connectAccount(String user, String password) {
        PluggyItemResponse item = pluggyClient.createItem(user, password);
        currentItemId.set(item.id());
        log.info("[PluggyService] Stored itemId={}", item.id());

        PluggyItemResponse ready = waitUntilReady(item.id());

        // Eagerly fetch and cache the first account ID
        PluggyAccountsResponse accounts = pluggyClient.getAccounts(ready.id());
        if (accounts.results() != null && !accounts.results().isEmpty()) {
            String accountId = accounts.results().get(0).id();
            currentAccountId.set(accountId);
            log.info("[PluggyService] Stored accountId={}", accountId);
        }

        return ready;
    }

    private PluggyItemResponse waitUntilReady(String itemId) {
        int maxAttempts = 10;
        int delayMs = 3000;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            PluggyItemResponse current = pluggyClient.getItem(itemId);
            log.info("[PluggyService] Polling item status — attempt={} status={}", attempt, current.status());

            if (!"UPDATING".equalsIgnoreCase(current.status())) {
                return current;
            }

            if (attempt < maxAttempts) {
                try { Thread.sleep(delayMs); } catch (InterruptedException e) { Thread.currentThread().interrupt(); break; }
            }
        }

        log.warn("[PluggyService] Item ainda em UPDATING após polling — prosseguindo assim mesmo");
        return pluggyClient.getItem(itemId);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Open Finance (Itaú, Bradesco, Santander, etc.)
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Inicia uma conexão Open Finance.
     * Retorna o Item com o `oauthUrl` — o usuário DEVE abrir essa URL no browser
     * para autorizar o acesso no banco (ex: Itaú). O processo é assíncrono.
     *
     * Conector IDs comuns:
     *   601 = Itaú PF
     *   (use GET /connectors?isOpenFinance=true para listar todos)
     */
    public PluggyItemResponse connectOpenFinance(int connectorId, String cpf) {
        PluggyItemResponse item = pluggyClient.createOpenFinanceItem(connectorId, cpf);
        currentItemId.set(item.id());
        log.info("[PluggyService] OF Item criado — itemId={} oauthUrl={}", item.id(), item.oauthUrl());
        return item;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Balance
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Returns the first account's balance for the connected item.
     *
     * @throws IllegalStateException if no account has been connected yet
     */
    public PluggyAccountResponse getBalance() {
        String itemId = requireItemId();
        PluggyAccountsResponse accounts = pluggyClient.getAccounts(itemId);

        if (accounts.results() == null || accounts.results().isEmpty()) {
            throw new IllegalStateException("No accounts found for itemId=" + itemId);
        }

        PluggyAccountResponse account = accounts.results().get(0);
        currentAccountId.set(account.id()); // keep in sync
        return account;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Transactions
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Returns the transaction list for the cached account.
     *
     * @throws IllegalStateException if no account has been connected yet
     */
    public PluggyTransactionsResponse getTransactions() {
        return pluggyClient.getTransactions(requireAccountId());
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ──────────────────────────────────────────────────────────────────────────

    private String requireItemId() {
        String id = currentItemId.get();
        if (id == null) {
            throw new IllegalStateException(
                    "No item connected. Call POST /pluggy/connect-account first.");
        }
        return id;
    }

    private String requireAccountId() {
        String id = currentAccountId.get();
        if (id == null) {
            throw new IllegalStateException(
                    "No account available. Call POST /pluggy/connect-account first.");
        }
        return id;
    }
}
