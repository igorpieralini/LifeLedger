package com.lifeledger.dto.response;

import java.util.List;

/**
 * Wrapper for the paginated accounts list from GET /accounts.
 */
public record PluggyAccountsResponse(
        Integer total,
        Integer totalPages,
        Integer page,
        List<PluggyAccountResponse> results
) {}
