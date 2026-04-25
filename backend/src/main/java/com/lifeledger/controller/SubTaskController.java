package com.lifeledger.controller;

import com.lifeledger.dto.SubTaskRequest;
import com.lifeledger.dto.SubTaskResponse;
import com.lifeledger.service.SubTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals/{goalId}/subtasks")
@RequiredArgsConstructor
public class SubTaskController {

    private final SubTaskService service;

    @GetMapping
    public List<SubTaskResponse> list(@PathVariable Long goalId) {
        return service.findAllByGoal(goalId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubTaskResponse create(@PathVariable Long goalId, @Valid @RequestBody SubTaskRequest request) {
        return service.create(goalId, request);
    }

    @PatchMapping("/{id}/toggle")
    public SubTaskResponse toggle(@PathVariable Long goalId, @PathVariable Long id) {
        return service.toggleComplete(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long goalId, @PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping
    public List<SubTaskResponse> replaceAll(@PathVariable Long goalId, @Valid @RequestBody List<SubTaskRequest> requests) {
        return service.replaceAll(goalId, requests);
    }
}
