package com.lifeledger.controller;

import com.lifeledger.dto.request.*;
import com.lifeledger.dto.response.*;
import com.lifeledger.service.PluggyService;import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * PluggyController — exposes three endpoints under /pluggy/*.
 *
 * POST /pluggy/connect-account  → connects a sandbox bank (creates an Item)
 * GET  /pluggy/balance          → returns the balance of the first linked account
 * GET  /pluggy/transactions     → returns the bank statement of that account
 */
@RestController
@RequestMapping("/pluggy")
public class PluggyController {

    private static final Logger log = LoggerFactory.getLogger(PluggyController.class);

    private final PluggyService pluggyService;

    public PluggyController(PluggyService pluggyService) {
        this.pluggyService = pluggyService;
    }

    /**
     * POST /pluggy/connect-open-finance
     *
     * Inicia conexão Open Finance (Itaú, Bradesco, Santander, etc.).
     * Retorna o item com o campo `oauthUrl` — o usuário deve abrir esse link
     * no browser para autorizar o acesso no internet banking do banco.
     *
     * Body: { "connectorId": 601, "cpf": "761.092.776-73" }
     *   601 = Itaú PF  |  use GET /connectors?isOpenFinance=true para listar outros
     */
    @PostMapping("/connect-open-finance")
    public ResponseEntity<?> connectOpenFinance(@RequestBody ConnectOpenFinanceRequest request) {
        log.info("[PluggyController] POST /pluggy/connect-open-finance connectorId={}", request.connectorId());
        try {
            PluggyItemResponse item = pluggyService.connectOpenFinance(request.connectorId(), request.cpf());
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            log.error("[PluggyController] connect-open-finance failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to start Open Finance connection", "detail", e.getMessage()));
        }
    }

    /**
     * POST /pluggy/connect-account
     *
     * Body: { "user": "user-ok", "password": "password-ok" }
     * (Pluggy sandbox connector 0 accepts these credentials.)
     */
    @PostMapping("/connect-account")
    public ResponseEntity<?> connectAccount(@RequestBody ConnectAccountRequest request) {
        log.info("[PluggyController] POST /pluggy/connect-account");
        try {
            PluggyItemResponse item = pluggyService.connectAccount(request.user(), request.password());
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            log.error("[PluggyController] connect-account failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to connect account", "detail", e.getMessage()));
        }
    }

    /**
     * GET /pluggy/balance
     *
     * Returns the balance of the first account linked via connect-account.
     */
    @GetMapping("/balance")
    public ResponseEntity<?> getBalance() {
        log.info("[PluggyController] GET /pluggy/balance");
        try {
            return ResponseEntity.ok(pluggyService.getBalance());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("[PluggyController] balance failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch balance", "detail", e.getMessage()));
        }
    }

    /**
     * GET /pluggy/transactions
     *
     * Returns the bank statement of the connected account.
     */
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions() {
        log.info("[PluggyController] GET /pluggy/transactions");
        try {
            return ResponseEntity.ok(pluggyService.getTransactions());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("[PluggyController] transactions failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch transactions", "detail", e.getMessage()));
        }
    }
}
