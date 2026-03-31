package com.lifeledger.dto.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * Monthly financial summary used by the dashboard and charts.
 */
public record FinanceSummaryResponse(
        int year,
        int month,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        List<CategoryBreakdown> expensesByCategory
) {
    public record CategoryBreakdown(
            String categoryName,
            String categoryColor,
            BigDecimal total,
            double percentage
    ) {}
}
