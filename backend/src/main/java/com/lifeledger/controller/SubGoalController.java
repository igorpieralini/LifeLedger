package com.lifeledger.controller;

import com.lifeledger.config.SecurityUtils;
import com.lifeledger.dto.request.ProgressUpdateRequest;
import com.lifeledger.dto.request.SubGoalRequest;
import com.lifeledger.dto.response.SubGoalResponse;
import com.lifeledger.service.SubGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sub-goals")
@RequiredArgsConstructor
public class SubGoalController {

    private final SubGoalService subGoalService;

    @PostMapping
    public ResponseEntity<SubGoalResponse> create(@Valid @RequestBody SubGoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subGoalService.create(request, SecurityUtils.currentUserId()));
    }

    @GetMapping("/goal/{goalId}")
    public ResponseEntity<List<SubGoalResponse>> findByGoal(@PathVariable Long goalId) {
        return ResponseEntity.ok(subGoalService.findByGoal(goalId, SecurityUtils.currentUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubGoalResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SubGoalRequest request) {
        return ResponseEntity.ok(subGoalService.update(id, request, SecurityUtils.currentUserId()));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<SubGoalResponse> updateProgress(
            @PathVariable Long id,
            @Valid @RequestBody ProgressUpdateRequest request) {
        return ResponseEntity.ok(subGoalService.updateProgress(id, request, SecurityUtils.currentUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subGoalService.delete(id, SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }
}
