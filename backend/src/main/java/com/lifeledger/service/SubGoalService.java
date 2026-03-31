package com.lifeledger.service;

import com.lifeledger.dto.request.ProgressUpdateRequest;
import com.lifeledger.dto.request.SubGoalRequest;
import com.lifeledger.dto.response.SubGoalResponse;

import java.util.List;

public interface SubGoalService {
    SubGoalResponse create(SubGoalRequest request, Long userId);
    List<SubGoalResponse> findByGoal(Long goalId, Long userId);
    SubGoalResponse update(Long id, SubGoalRequest request, Long userId);
    SubGoalResponse updateProgress(Long id, ProgressUpdateRequest request, Long userId);
    void delete(Long id, Long userId);
}
