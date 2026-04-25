package com.lifeledger.repository;

import com.lifeledger.domain.SubTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubTaskRepository extends JpaRepository<SubTask, Long> {
    List<SubTask> findByGoalIdOrderByDisplayOrderAsc(Long goalId);
    void deleteAllByGoalId(Long goalId);
}
