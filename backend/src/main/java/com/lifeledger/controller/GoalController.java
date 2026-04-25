package com.lifeledger.controller;

import com.lifeledger.domain.GoalCategory;
import com.lifeledger.dto.GoalRequest;
import com.lifeledger.dto.GoalResponse;
import com.lifeledger.dto.ProgressRequest;
import com.lifeledger.dto.StatusRequest;
import com.lifeledger.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService service;

    @GetMapping
    public List<GoalResponse> list(@RequestParam(required = false) GoalCategory category) {
        return service.findAll(category);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalResponse create(@Valid @RequestBody GoalRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public GoalResponse update(@PathVariable Long id, @Valid @RequestBody GoalRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public GoalResponse updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return service.updateStatus(id, request.status());
    }

    @PatchMapping("/{id}/progress")
    public GoalResponse updateProgress(@PathVariable Long id, @Valid @RequestBody ProgressRequest request) {
        return service.updateProgress(id, request.progress());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
