package com.lifeledger.dto.response;

import java.math.BigDecimal;

public record PluggyTransactionResponse(
        String id, String accountId, String description, String currencyCode,
        BigDecimal amount, String date, String type, String category, String status
) {}
