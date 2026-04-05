package com.lifeledger.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record FinanceLimitsResponse(
        int year,
        int month,
        List<CategoryLimitStatus> categories
) {
    public record CategoryLimitStatus(
            String categoryName,
            BigDecimal limitAmount,
            BigDecimal spent,
            BigDecimal remaining,
            double usedPercentage,
            boolean exceeded
    ) {}
}
