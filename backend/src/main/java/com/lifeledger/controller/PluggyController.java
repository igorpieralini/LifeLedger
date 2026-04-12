package com.lifeledger.controller;

import com.lifeledger.dto.request.ConnectAccountRequest;
import com.lifeledger.dto.request.ConnectOpenFinanceRequest;
import com.lifeledger.dto.response.PluggyItemResponse;
import com.lifeledger.service.PluggyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/pluggy")
public class PluggyController {

    private static final Logger log = LoggerFactory.getLogger(PluggyController.class);
    private final PluggyService pluggyService;

    public PluggyController(PluggyService pluggyService) {
        this.pluggyService = pluggyService;
    }

    @PostMapping("/connect-open-finance")
    public ResponseEntity<?> connectOpenFinance(@RequestBody ConnectOpenFinanceRequest request) {
        try {
            return ResponseEntity.ok(pluggyService.connectOpenFinance(request.connectorId(), request.cpf()));
        } catch (Exception e) {
            log.error("connect-open-finance failed", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/connect-account")
    public ResponseEntity<?> connectAccount(@RequestBody ConnectAccountRequest request) {
        try {
            return ResponseEntity.ok(pluggyService.connectAccount(request.user(), request.password()));
        } catch (Exception e) {
            log.error("connect-account failed", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance() {
        try {
            return ResponseEntity.ok(pluggyService.getBalance());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("balance failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions() {
        try {
            return ResponseEntity.ok(pluggyService.getTransactions());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("transactions failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
