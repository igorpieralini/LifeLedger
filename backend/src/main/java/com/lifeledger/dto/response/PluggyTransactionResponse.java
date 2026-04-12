package com.lifeledger.dto.response;

import java.math.BigDecimal;

/**
 * A single transaction entry within a bank account statement.
 */
public record PluggyTransactionResponse(
        String id,
        String accountId,
        String description,
        String currencyCode,
        BigDecimal amount,
        String date,
        String type,         // DEBIT | CREDIT
        String category,
        String status        // POSTED | PENDING
) {}
