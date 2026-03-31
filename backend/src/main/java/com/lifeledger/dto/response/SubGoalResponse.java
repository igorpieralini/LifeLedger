package com.lifeledger.dto.response;

import com.lifeledger.domain.Goal.GoalStatus;
import com.lifeledger.domain.SubGoal;
import com.lifeledger.domain.SubGoal.GoalPeriod;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SubGoalResponse(
        Long id,
        Long goalId,
        String title,
        String description,
        GoalPeriod period,
        LocalDate referenceDate,
        BigDecimal targetValue,
        BigDecimal currentValue,
        int progress,
        GoalStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SubGoalResponse from(SubGoal s) {
        return new SubGoalResponse(
                s.getId(), s.getGoal().getId(),
                s.getTitle(), s.getDescription(),
                s.getPeriod(), s.getReferenceDate(),
                s.getTargetValue(), s.getCurrentValue(),
                s.getProgress(), s.getStatus(),
                s.getCreatedAt(), s.getUpdatedAt()
        );
    }
}
