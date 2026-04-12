package com.lifeledger.repository;

import com.lifeledger.domain.Goal;
import com.lifeledger.domain.Goal.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserIdOrderByYearDescCreatedAtDesc(Long userId);

    List<Goal> findByUserIdAndYearOrderByCreatedAtDesc(Long userId, Short year);

    List<Goal> findByUserIdAndStatusIn(Long userId, List<GoalStatus> statuses);

    Optional<Goal> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, GoalStatus status);

    @Query("SELECT AVG(g.progress) FROM Goal g WHERE g.user.id = :userId")
    Double avgProgressByUserId(Long userId);
}
