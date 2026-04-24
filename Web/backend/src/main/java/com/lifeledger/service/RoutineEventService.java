package com.lifeledger.service;

import com.lifeledger.domain.RoutineEvent;
import com.lifeledger.dto.RoutineEventRequest;
import com.lifeledger.dto.RoutineEventResponse;
import com.lifeledger.exception.ResourceNotFoundException;
import com.lifeledger.repository.RoutineEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoutineEventService {

    private final RoutineEventRepository repository;

    public List<RoutineEventResponse> findAll() {
        return repository.findAllByOrderByDayOfWeekAscStartTimeAsc()
                .stream().map(RoutineEventResponse::from).toList();
    }

    @Transactional
    public RoutineEventResponse create(RoutineEventRequest request) {
        RoutineEvent event = new RoutineEvent();
        applyFields(event, request);
        return RoutineEventResponse.from(repository.save(event));
    }

    @Transactional
    public RoutineEventResponse update(Long id, RoutineEventRequest request) {
        RoutineEvent event = findById(id);
        applyFields(event, request);
        return RoutineEventResponse.from(repository.save(event));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Routine event not found: " + id);
        }
        repository.deleteById(id);
    }

    private RoutineEvent findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Routine event not found: " + id));
    }

    private void applyFields(RoutineEvent event, RoutineEventRequest req) {
        event.setTitle(req.title().trim());
        event.setDayOfWeek(req.dayOfWeek());
        event.setStartTime(req.startTime());
        event.setEndTime(req.endTime());
        event.setColor(req.color() != null ? req.color() : "#6366f1");
    }
}
