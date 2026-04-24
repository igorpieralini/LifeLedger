package com.lifeledger.dto;

import jakarta.validation.constraints.*;

import java.time.LocalTime;

public record RoutineEventRequest(
        @NotBlank @Size(max = 255) String title,
        @NotNull @Min(0) @Max(6) Integer dayOfWeek,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @Size(max = 20) String color
) {}
