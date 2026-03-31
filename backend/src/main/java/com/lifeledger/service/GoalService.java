package com.lifeledger.service;

import com.lifeledger.domain.Goal.GoalStatus;
import com.lifeledger.dto.request.GoalRequest;
import com.lifeledger.dto.request.ProgressUpdateRequest;
import com.lifeledger.dto.response.GoalResponse;

import java.util.List;

public interface GoalService {
    GoalResponse create(GoalRequest request, Long userId);
    GoalResponse findById(Long id, Long userId);
    List<GoalResponse> findAllByUser(Long userId, Integer year);
    GoalResponse update(Long id, GoalRequest request, Long userId);
    GoalResponse updateProgress(Long id, ProgressUpdateRequest request, Long userId);
    GoalResponse updateStatus(Long id, GoalStatus status, Long userId);
    void delete(Long id, Long userId);
}
