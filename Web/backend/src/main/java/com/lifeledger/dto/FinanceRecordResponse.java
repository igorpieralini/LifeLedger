package com.lifeledger.dto;

import com.lifeledger.domain.FinanceRecord;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FinanceRecordResponse(
        Long id,
        Short year,
        Short month,
        BigDecimal monthlyIncome,
        BigDecimal monthlyInvestment,
        BigDecimal creditCardLimit,
        BigDecimal debitCardLimit,
        BigDecimal debts,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static FinanceRecordResponse from(FinanceRecord r) {
        return new FinanceRecordResponse(
                r.getId(),
                r.getYear(),
                r.getMonth(),
                r.getMonthlyIncome(),
                r.getMonthlyInvestment(),
                r.getCreditCardLimit(),
                r.getDebitCardLimit(),
                r.getDebts(),
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }
}
