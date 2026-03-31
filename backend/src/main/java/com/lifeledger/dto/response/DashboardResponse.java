package com.lifeledger.dto.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated data for the home dashboard.
 */
public record DashboardResponse(
        // Finance
        BigDecimal currentMonthIncome,
        BigDecimal currentMonthExpense,
        BigDecimal currentMonthBalance,
        BigDecimal totalBalance,

        // Goals
        long totalGoals,
        long completedGoals,
        long delayedGoals,
        double averageGoalProgress,

        // Recent items
        List<TransactionResponse> recentTransactions,
        List<GoalResponse> activeGoals
) {}
