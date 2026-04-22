package com.lifeledger.repository;

import com.lifeledger.domain.Goal;
import com.lifeledger.domain.GoalCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByCategoryOrderByCreatedAtDesc(GoalCategory category);
    List<Goal> findAllByOrderByCreatedAtDesc();
}
