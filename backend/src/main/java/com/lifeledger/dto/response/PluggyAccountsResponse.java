package com.lifeledger.dto.response;

import java.util.List;

public record PluggyAccountsResponse(
        Integer total, Integer totalPages, Integer page,
        List<PluggyAccountResponse> results
) {}
