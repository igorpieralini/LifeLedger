package com.lifeledger.dto;

import com.lifeledger.domain.GoalCategory;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record GoalRequest(
        @NotBlank @Size(max = 255) String title,
        @Size(max = 1000) String description,
        @NotNull GoalCategory category,
        LocalDate targetDate,
        @Min(0) @Max(100) Integer progress
) {}
