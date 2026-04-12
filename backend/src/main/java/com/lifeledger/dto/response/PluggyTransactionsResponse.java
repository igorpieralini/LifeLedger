package com.lifeledger.dto.response;

import java.util.List;

public record PluggyTransactionsResponse(
        Integer total, Integer totalPages, Integer page,
        List<PluggyTransactionResponse> results
) {}
