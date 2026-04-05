package com.lifeledger.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CategoryLimitRequest(
        @NotBlank(message = "Category name is required")
        @Size(max = 255)
        String categoryName,

        @NotNull(message = "Limit amount is required")
        @DecimalMin(value = "0.01", message = "Limit must be greater than zero")
        BigDecimal limitAmount
) {}
