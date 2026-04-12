package com.lifeledger.dto.response;

import java.util.List;

/**
 * Wrapper for the paginated transactions list from GET /transactions.
 */
public record PluggyTransactionsResponse(
        Integer total,
        Integer totalPages,
        Integer page,
        List<PluggyTransactionResponse> results
) {}
