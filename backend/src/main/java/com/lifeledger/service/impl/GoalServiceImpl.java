package com.lifeledger.service.impl;

import com.lifeledger.domain.Goal;
import com.lifeledger.domain.Goal.GoalStatus;
import com.lifeledger.domain.User;
import com.lifeledger.dto.request.GoalRequest;
import com.lifeledger.dto.request.ProgressUpdateRequest;
import com.lifeledger.dto.response.GoalResponse;
import com.lifeledger.exception.ResourceNotFoundException;
import com.lifeledger.repository.GoalRepository;
import com.lifeledger.repository.UserRepository;
import com.lifeledger.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public GoalResponse create(GoalRequest request, Long userId) {
        User user = getUser(userId);
        Goal goal = Goal.builder()
                .user(user)
                .title(request.title())
                .description(request.description())
                .year(request.year().shortValue())
                .targetValue(request.targetValue())
                .deadline(request.deadline())
                .build();
        return GoalResponse.from(goalRepository.save(goal));
    }

    @Override
    @Transactional(readOnly = true)
    public GoalResponse findById(Long id, Long userId) {
        return GoalResponse.from(getGoal(id, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoalResponse> findAllByUser(Long userId, Integer year) {
        List<Goal> goals = year != null
                ? goalRepository.findByUserIdAndYearOrderByCreatedAtDesc(userId, year.shortValue())
                : goalRepository.findByUserIdOrderByYearDescCreatedAtDesc(userId);
        return goals.stream().map(GoalResponse::from).toList();
    }

    @Override
    @Transactional
    public GoalResponse update(Long id, GoalRequest request, Long userId) {
        Goal goal = getGoal(id, userId);
        goal.setTitle(request.title());
        goal.setDescription(request.description());
        goal.setYear(request.year().shortValue());
        goal.setTargetValue(request.targetValue());
        goal.setDeadline(request.deadline());
        return GoalResponse.from(goalRepository.save(goal));
    }

    @Override
    @Transactional
    public GoalResponse updateProgress(Long id, ProgressUpdateRequest request, Long userId) {
        Goal goal = getGoal(id, userId);
        goal.setCurrentValue(request.currentValue());

        // Recalculate progress percentage when a target exists
        if (goal.getTargetValue() != null && goal.getTargetValue().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal pct = request.currentValue()
                    .divide(goal.getTargetValue(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            goal.setProgress((short) Math.min(100, pct.intValue()));

            if (goal.getProgress() >= 100) {
                goal.setStatus(GoalStatus.COMPLETED);
            }
        }

        return GoalResponse.from(goalRepository.save(goal));
    }

    @Override
    @Transactional
    public GoalResponse updateStatus(Long id, GoalStatus status, Long userId) {
        Goal goal = getGoal(id, userId);
        goal.setStatus(status);
        return GoalResponse.from(goalRepository.save(goal));
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        Goal goal = getGoal(id, userId);
        goalRepository.delete(goal);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Goal getGoal(Long id, Long userId) {
        return goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("Goal", id));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
    }
}
