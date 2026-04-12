package com.lifeledger.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal currentMonthIncome,
        BigDecimal currentMonthExpense,
        BigDecimal currentMonthBalance,
        BigDecimal totalBalance,

        long totalGoals,
        long completedGoals,
        long delayedGoals,
        double averageGoalProgress,

        List<TransactionResponse> recentTransactions,
        List<GoalResponse> activeGoals
) {}
