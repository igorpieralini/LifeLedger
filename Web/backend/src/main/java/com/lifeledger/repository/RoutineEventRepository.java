package com.lifeledger.repository;

import com.lifeledger.domain.RoutineEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoutineEventRepository extends JpaRepository<RoutineEvent, Long> {
    List<RoutineEvent> findAllByOrderByDayOfWeekAscStartTimeAsc();
}
