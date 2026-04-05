package com.lifeledger.controller;

import com.lifeledger.domain.CategoryLimit;
import com.lifeledger.dto.request.CategoryLimitRequest;
import com.lifeledger.service.CategoryLimitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category-limits")
@RequiredArgsConstructor
public class CategoryLimitController {

    private final CategoryLimitService categoryLimitService;

    @GetMapping
    public ResponseEntity<List<CategoryLimit>> findAll() {
        return ResponseEntity.ok(categoryLimitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryLimit> findById(@PathVariable Long id) {
        return categoryLimitService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoryLimit> create(@Valid @RequestBody CategoryLimitRequest request) {
        CategoryLimit limit = CategoryLimit.builder()
                .categoryName(request.categoryName())
                .limitAmount(request.limitAmount())
                .build();
        CategoryLimit saved = categoryLimitService.save(limit);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryLimit> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryLimitRequest request) {
        return categoryLimitService.findById(id)
                .map(limit -> {
                    limit.setCategoryName(request.categoryName());
                    limit.setLimitAmount(request.limitAmount());
                    CategoryLimit updated = categoryLimitService.save(limit);
                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (categoryLimitService.findById(id).isPresent()) {
            categoryLimitService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
