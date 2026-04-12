package com.lifeledger.dto.response;

import java.math.BigDecimal;

/**
 * A single bank account returned by GET /accounts.
 */
public record PluggyAccountResponse(
        String id,
        String itemId,
        String name,
        String type,
        String subtype,
        String number,
        BigDecimal balance,
        String currencyCode,
        String owner
) {}
