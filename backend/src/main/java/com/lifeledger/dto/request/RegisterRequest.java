package com.lifeledger.dto.request;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100)
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        String password
) {}
