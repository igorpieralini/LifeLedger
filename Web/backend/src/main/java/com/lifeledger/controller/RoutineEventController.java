package com.lifeledger.controller;

import com.lifeledger.dto.RoutineEventRequest;
import com.lifeledger.dto.RoutineEventResponse;
import com.lifeledger.service.RoutineEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routine-events")
@RequiredArgsConstructor
public class RoutineEventController {

    private final RoutineEventService service;

    @GetMapping
    public List<RoutineEventResponse> list() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoutineEventResponse create(@Valid @RequestBody RoutineEventRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public RoutineEventResponse update(@PathVariable Long id,
                                        @Valid @RequestBody RoutineEventRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
