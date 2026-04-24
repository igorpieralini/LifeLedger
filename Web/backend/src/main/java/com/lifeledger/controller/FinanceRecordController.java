package com.lifeledger.controller;

import com.lifeledger.dto.FinanceRecordRequest;
import com.lifeledger.dto.FinanceRecordResponse;
import com.lifeledger.service.FinanceRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/finance-records")
@RequiredArgsConstructor
public class FinanceRecordController {

    private final FinanceRecordService service;

    @GetMapping
    public ResponseEntity<FinanceRecordResponse> getByMonth(
            @RequestParam Short year,
            @RequestParam Short month) {
        return service.getByMonth(year, month)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/all")
    public List<FinanceRecordResponse> listAll() {
        return service.listAll();
    }

    @PutMapping
    public FinanceRecordResponse save(@Valid @RequestBody FinanceRecordRequest request) {
        return service.save(request);
    }
}
