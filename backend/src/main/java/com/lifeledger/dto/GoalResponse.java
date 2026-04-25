package com.lifeledger.dto;

import com.lifeledger.domain.GoalCategory;
import com.lifeledger.domain.GoalStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record GoalResponse(
        Long id,
        String title,
        String description,
        GoalCategory category,
        GoalStatus status,
        LocalDate targetDate,
        int progress,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<SubTaskResponse> subTasks
) {}
