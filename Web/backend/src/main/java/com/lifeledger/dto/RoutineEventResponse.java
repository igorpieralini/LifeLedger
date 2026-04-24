package com.lifeledger.dto;

import com.lifeledger.domain.RoutineEvent;

import java.time.LocalTime;

public record RoutineEventResponse(
        Long id,
        String title,
        int dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        String color
) {
    public static RoutineEventResponse from(RoutineEvent e) {
        return new RoutineEventResponse(
                e.getId(), e.getTitle(), e.getDayOfWeek(),
                e.getStartTime(), e.getEndTime(), e.getColor()
        );
    }
}
