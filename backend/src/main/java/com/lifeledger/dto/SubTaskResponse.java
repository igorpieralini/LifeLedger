package com.lifeledger.dto;

import com.lifeledger.domain.SubTask;

import java.time.LocalDateTime;

public record SubTaskResponse(
        Long id,
        String title,
        Boolean completed,
        Integer displayOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SubTaskResponse from(SubTask subTask) {
        return new SubTaskResponse(
                subTask.getId(),
                subTask.getTitle(),
                subTask.getCompleted(),
                subTask.getDisplayOrder(),
                subTask.getCreatedAt(),
                subTask.getUpdatedAt()
        );
    }
}
