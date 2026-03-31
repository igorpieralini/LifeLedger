package com.lifeledger.dto.request;

import com.lifeledger.domain.SubGoal.GoalPeriod;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SubGoalRequest(
        @NotNull Long goalId,

        @NotBlank @Size(max = 200) String title,

        String description,

        @NotNull GoalPeriod period,

        @NotNull LocalDate referenceDate,

        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal targetValue
) {}
