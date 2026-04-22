package com.lifeledger.dto.response;

import com.lifeledger.domain.Goal;
import com.lifeledger.domain.Goal.GoalCategory;
import com.lifeledger.domain.Goal.GoalStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record GoalResponse(
        Long id,
        String title,
        String description,
        int year,
        boolean financial,
        GoalCategory category,
        String icon,
        String color,
        BigDecimal targetValue,
        BigDecimal currentValue,
        int progress,
        GoalStatus status,
        LocalDate deadline,
        List<SubGoalResponse> subGoals,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static GoalResponse from(Goal g) {
        return new GoalResponse(
                g.getId(), g.getTitle(), g.getDescription(),
                g.getYear(), Boolean.TRUE.equals(g.getFinancial()),
                g.getCategory(), g.getIcon(), g.getColor(),
                g.getTargetValue(), g.getCurrentValue(),
                g.getProgress(), g.getStatus(), g.getDeadline(),
                g.getSubGoals().stream().map(SubGoalResponse::from).toList(),
                g.getCreatedAt(), g.getUpdatedAt()
        );
    }
}
