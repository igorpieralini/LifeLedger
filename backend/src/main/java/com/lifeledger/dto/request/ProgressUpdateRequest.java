package com.lifeledger.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProgressUpdateRequest(
        @NotNull
        @DecimalMin("0.0")
        BigDecimal currentValue
) {}
