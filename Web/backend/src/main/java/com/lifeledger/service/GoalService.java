package com.lifeledger.service;

import com.lifeledger.domain.Goal;
import com.lifeledger.domain.GoalCategory;
import com.lifeledger.domain.GoalStatus;
import com.lifeledger.dto.GoalRequest;
import com.lifeledger.dto.GoalResponse;
import com.lifeledger.dto.SubTaskResponse;
import com.lifeledger.exception.ResourceNotFoundException;
import com.lifeledger.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository repository;

    public List<GoalResponse> findAll(GoalCategory category) {
        List<Goal> goals = category != null
                ? repository.findByCategoryOrderByCreatedAtDesc(category)
                : repository.findAllByOrderByCreatedAtDesc();
        return goals.stream().map(this::toResponse).toList();
    }

    @Transactional
    public GoalResponse create(GoalRequest request) {
        Goal goal = new Goal();
        goal.setTitle(request.title().trim());
        goal.setDescription(trimOrNull(request.description()));
        goal.setCategory(request.category());
        goal.setTargetDate(request.targetDate());
        goal.setProgress(request.progress() != null ? request.progress() : 0);
        return toResponse(repository.save(goal));
    }

    @Transactional
    public GoalResponse update(Long id, GoalRequest request) {
        Goal goal = findById(id);
        goal.setTitle(request.title().trim());
        goal.setDescription(trimOrNull(request.description()));
        goal.setCategory(request.category());
        goal.setTargetDate(request.targetDate());
        // Só atualiza progresso manual se não tiver subtarefas
        if (goal.getSubTasks().isEmpty() && request.progress() != null) {
            goal.setProgress(request.progress());
        }
        return toResponse(repository.save(goal));
    }

    @Transactional
    public GoalResponse updateStatus(Long id, GoalStatus status) {
        Goal goal = findById(id);
        goal.setStatus(status);
        if (status == GoalStatus.COMPLETED) goal.setProgress(100);
        return toResponse(repository.save(goal));
    }

    @Transactional
    public GoalResponse updateProgress(Long id, int progress) {
        Goal goal = findById(id);
        goal.setProgress(progress);
        if (progress >= 100) goal.setStatus(GoalStatus.COMPLETED);
        return toResponse(repository.save(goal));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Goal not found: " + id);
        }
        repository.deleteById(id);
    }

    private Goal findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + id));
    }

    private GoalResponse toResponse(Goal g) {
        List<SubTaskResponse> subTasks = g.getSubTasks().stream()
                .map(SubTaskResponse::from)
                .toList();
        
        return new GoalResponse(
                g.getId(), g.getTitle(), g.getDescription(),
                g.getCategory(), g.getStatus(), g.getTargetDate(),
                g.getProgress(), g.getCreatedAt(), g.getUpdatedAt(),
                subTasks
        );
    }

    private String trimOrNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
