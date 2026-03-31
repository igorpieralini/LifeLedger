package com.lifeledger.controller;

import com.lifeledger.config.SecurityUtils;
import com.lifeledger.dto.request.TransactionRequest;
import com.lifeledger.dto.response.FinanceSummaryResponse;
import com.lifeledger.dto.response.TransactionResponse;
import com.lifeledger.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(request, SecurityUtils.currentUserId()));
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> listAll(
            @PageableDefault(size = 20, sort = "date") Pageable pageable) {
        return ResponseEntity.ok(transactionService.findAll(SecurityUtils.currentUserId(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.findById(id, SecurityUtils.currentUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.update(id, request, SecurityUtils.currentUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.delete(id, SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<FinanceSummaryResponse> summary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        // Default to current year/month when not provided
        int y = year  != null ? year  : java.time.LocalDate.now().getYear();
        int m = month != null ? month : java.time.LocalDate.now().getMonthValue();
        return ResponseEntity.ok(transactionService.getSummary(SecurityUtils.currentUserId(), y, m));
    }
}
