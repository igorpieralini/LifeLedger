package com.lifeledger.service.impl;

import com.lifeledger.domain.Goal.GoalStatus;
import com.lifeledger.dto.response.DashboardResponse;
import com.lifeledger.dto.response.GoalResponse;
import com.lifeledger.dto.response.TransactionResponse;
import com.lifeledger.repository.GoalRepository;
import com.lifeledger.repository.TransactionRepository;
import com.lifeledger.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static com.lifeledger.domain.Transaction.TransactionType.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final GoalRepository goalRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        LocalDate now   = LocalDate.now();
        LocalDate from  = now.withDayOfMonth(1);
        LocalDate to    = now.withDayOfMonth(now.lengthOfMonth());

        BigDecimal monthIncome  = transactionRepository.sumByUserIdAndTypeAndDateBetween(userId, INCOME,  from, to);
        BigDecimal monthExpense = transactionRepository.sumByUserIdAndTypeAndDateBetween(userId, EXPENSE, from, to);
        BigDecimal totalBalance = transactionRepository.totalBalanceByUserId(userId);

        long total     = goalRepository.countByUserId(userId);
        long completed = goalRepository.countByUserIdAndStatus(userId, GoalStatus.COMPLETED);
        long delayed   = goalRepository.countByUserIdAndStatus(userId, GoalStatus.DELAYED);
        Double avgProgress = goalRepository.avgProgressByUserId(userId);

        List<TransactionResponse> recentTxs = transactionRepository
                .findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(TransactionResponse::from).toList();

        List<GoalResponse> activeGoals = goalRepository
                .findByUserIdAndStatusIn(userId, List.of(GoalStatus.IN_PROGRESS, GoalStatus.DELAYED))
                .stream().map(GoalResponse::from).toList();

        return new DashboardResponse(
                monthIncome, monthExpense, monthIncome.subtract(monthExpense), totalBalance,
                total, completed, delayed, avgProgress != null ? avgProgress : 0,
                recentTxs, activeGoals
        );
    }
}
