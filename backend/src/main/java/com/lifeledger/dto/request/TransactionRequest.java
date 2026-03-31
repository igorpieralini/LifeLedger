package com.lifeledger.dto.request;

import com.lifeledger.domain.Transaction.TransactionType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotNull TransactionType type,

        @NotNull
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        BigDecimal amount,

        @NotBlank @Size(max = 255) String description,

        @NotNull LocalDate date,

        Long categoryId,

        String notes
) {}
