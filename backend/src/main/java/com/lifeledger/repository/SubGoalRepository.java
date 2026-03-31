package com.lifeledger.repository;

import com.lifeledger.domain.SubGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubGoalRepository extends JpaRepository<SubGoal, Long> {
    List<SubGoal> findByGoalIdAndUserId(Long goalId, Long userId);
    Optional<SubGoal> findByIdAndUserId(Long id, Long userId);
}
