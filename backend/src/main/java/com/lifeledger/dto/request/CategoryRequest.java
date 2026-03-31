package com.lifeledger.dto.request;

import com.lifeledger.domain.Category.CategoryType;
import jakarta.validation.constraints.*;

public record CategoryRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull CategoryType type,
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Color must be a valid hex code") String color,
        @Size(max = 50) String icon
) {}
