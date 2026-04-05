package com.lifeledger.dto.request;

import com.lifeledger.domain.Goal.GoalStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 200)
        String title,

        String description,

        @NotNull(message = "Year is required")
        @Min(value = 2020)
        @Max(value = 2100)
        Integer year,

        Boolean financial,

        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal targetValue,

        LocalDate deadline
) {}
