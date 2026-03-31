package com.lifeledger.service.impl;

import com.lifeledger.domain.Goal;
import com.lifeledger.domain.SubGoal;
import com.lifeledger.domain.User;
import com.lifeledger.dto.request.ProgressUpdateRequest;
import com.lifeledger.dto.request.SubGoalRequest;
import com.lifeledger.dto.response.SubGoalResponse;
import com.lifeledger.exception.ResourceNotFoundException;
import com.lifeledger.repository.GoalRepository;
import com.lifeledger.repository.SubGoalRepository;
import com.lifeledger.repository.UserRepository;
import com.lifeledger.service.SubGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubGoalServiceImpl implements SubGoalService {

    private final SubGoalRepository subGoalRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public SubGoalResponse create(SubGoalRequest request, Long userId) {
        User user = getUser(userId);
        Goal goal = goalRepository.findByIdAndUserId(request.goalId(), userId)
                .orElseThrow(() -> ResourceNotFoundException.of("Goal", request.goalId()));

        SubGoal sub = SubGoal.builder()
                .goal(goal)
                .user(user)
                .title(request.title())
                .description(request.description())
                .period(request.period())
                .referenceDate(request.referenceDate())
                .targetValue(request.targetValue())
                .build();

        return SubGoalResponse.from(subGoalRepository.save(sub));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubGoalResponse> findByGoal(Long goalId, Long userId) {
        return subGoalRepository.findByGoalIdAndUserId(goalId, userId)
                .stream().map(SubGoalResponse::from).toList();
    }

    @Override
    @Transactional
    public SubGoalResponse update(Long id, SubGoalRequest request, Long userId) {
        SubGoal sub = getSub(id, userId);
        sub.setTitle(request.title());
        sub.setDescription(request.description());
        sub.setPeriod(request.period());
        sub.setReferenceDate(request.referenceDate());
        sub.setTargetValue(request.targetValue());
        return SubGoalResponse.from(subGoalRepository.save(sub));
    }

    @Override
    @Transactional
    public SubGoalResponse updateProgress(Long id, ProgressUpdateRequest request, Long userId) {
        SubGoal sub = getSub(id, userId);
        sub.setCurrentValue(request.currentValue());

        if (sub.getTargetValue() != null && sub.getTargetValue().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal pct = request.currentValue()
                    .divide(sub.getTargetValue(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            sub.setProgress((short) Math.min(100, pct.intValue()));

            if (sub.getProgress() >= 100) {
                sub.setStatus(Goal.GoalStatus.COMPLETED);
            }
        }

        return SubGoalResponse.from(subGoalRepository.save(sub));
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        SubGoal sub = getSub(id, userId);
        subGoalRepository.delete(sub);
    }

    private SubGoal getSub(Long id, Long userId) {
        return subGoalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("SubGoal", id));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
    }
}
