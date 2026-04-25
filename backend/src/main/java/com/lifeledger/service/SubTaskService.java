package com.lifeledger.service;

import com.lifeledger.domain.Goal;
import com.lifeledger.domain.SubTask;
import com.lifeledger.dto.SubTaskRequest;
import com.lifeledger.dto.SubTaskResponse;
import com.lifeledger.exception.ResourceNotFoundException;
import com.lifeledger.repository.GoalRepository;
import com.lifeledger.repository.SubTaskRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubTaskService {

    private final SubTaskRepository subTaskRepository;
    private final GoalRepository goalRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<SubTaskResponse> findAllByGoal(Long goalId) {
        return subTaskRepository.findByGoalIdOrderByDisplayOrderAsc(goalId)
                .stream()
                .map(SubTaskResponse::from)
                .toList();
    }

    @Transactional
    public SubTaskResponse create(Long goalId, SubTaskRequest request) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        SubTask subTask = new SubTask();
        subTask.setTitle(request.title());
        subTask.setCompleted(false);
        subTask.setDisplayOrder(goal.getSubTasks().size());
        goal.addSubTask(subTask);
        
        goal.setProgress(goal.calculateProgress());
        goalRepository.save(goal);

        return SubTaskResponse.from(subTask);
    }

    @Transactional
    public SubTaskResponse toggleComplete(Long id) {
        SubTask subTask = subTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTask not found"));

        subTask.setCompleted(!subTask.getCompleted());
        subTaskRepository.save(subTask);

        entityManager.flush();
        entityManager.refresh(subTask.getGoal());

        Goal goal = subTask.getGoal();
        goal.setProgress(goal.calculateProgress());
        goalRepository.save(goal);

        return SubTaskResponse.from(subTask);
    }

    @Transactional
    public void delete(Long id) {
        if (!subTaskRepository.existsById(id)) {
            throw new ResourceNotFoundException("SubTask not found");
        }

        SubTask subTask = subTaskRepository.findById(id).get();
        Long goalId = subTask.getGoal().getId();

        // Detach para evitar conflitos
        entityManager.detach(subTask);
        
        // Deleta via query direto no banco
        subTaskRepository.deleteById(id);
        entityManager.flush();
        entityManager.clear();

        // Recarrega o goal limpo do banco
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        goal.setProgress(goal.calculateProgress());
        goalRepository.save(goal);
    }

    @Transactional
    public List<SubTaskResponse> replaceAll(Long goalId, List<SubTaskRequest> requests) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        // Remove todas as subtasks existentes
        goal.getSubTasks().clear();
        goalRepository.save(goal);
        entityManager.flush();

        // Cria as novas
        for (int i = 0; i < requests.size(); i++) {
            SubTask st = new SubTask();
            st.setTitle(requests.get(i).title());
            st.setCompleted(false);
            st.setDisplayOrder(i);
            goal.addSubTask(st);
        }

        goal.setProgress(goal.calculateProgress());
        Goal saved = goalRepository.save(goal);

        return saved.getSubTasks().stream()
                .map(SubTaskResponse::from)
                .toList();
    }
}
