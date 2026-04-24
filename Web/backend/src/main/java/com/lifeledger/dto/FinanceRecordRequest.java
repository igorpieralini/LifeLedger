package com.lifeledger.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record FinanceRecordRequest(
        @NotNull @Min(2000) @Max(2100) Short year,
        @NotNull @Min(1) @Max(12) Short month,
        @NotNull @Min(0) BigDecimal monthlyIncome,
        @NotNull @Min(0) BigDecimal monthlyInvestment,
        @NotNull @Min(0) BigDecimal creditCardLimit,
        @NotNull @Min(0) BigDecimal debitCardLimit,
        @NotNull @Min(0) BigDecimal debts
) {}
