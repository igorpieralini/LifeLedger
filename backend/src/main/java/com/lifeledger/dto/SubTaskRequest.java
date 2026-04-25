package com.lifeledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubTaskRequest(
        @NotBlank @Size(max = 255) String title
) {}
