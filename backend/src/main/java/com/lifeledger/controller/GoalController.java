package com.lifeledger.controller;

import com.lifeledger.config.SecurityUtils;
import com.lifeledger.domain.Goal.GoalStatus;
import com.lifeledger.dto.request.GoalRequest;
import com.lifeledger.dto.request.ProgressUpdateRequest;
import com.lifeledger.dto.response.GoalResponse;
import com.lifeledger.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> create(@Valid @RequestBody GoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(goalService.create(request, SecurityUtils.currentUserId()));
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> listAll(
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(goalService.findAllByUser(SecurityUtils.currentUserId(), year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.findById(id, SecurityUtils.currentUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.update(id, request, SecurityUtils.currentUserId()));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<GoalResponse> updateProgress(
            @PathVariable Long id,
            @Valid @RequestBody ProgressUpdateRequest request) {
        return ResponseEntity.ok(goalService.updateProgress(id, request, SecurityUtils.currentUserId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<GoalResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam GoalStatus status) {
        return ResponseEntity.ok(goalService.updateStatus(id, status, SecurityUtils.currentUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        goalService.delete(id, SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }
}
