package com.lifeledger.controller;

import com.lifeledger.config.SecurityUtils;
import com.lifeledger.dto.request.CategoryRequest;
import com.lifeledger.dto.response.CategoryResponse;
import com.lifeledger.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.create(request, SecurityUtils.currentUserId()));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listAll() {
        return ResponseEntity.ok(categoryService.findAll(SecurityUtils.currentUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request, SecurityUtils.currentUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id, SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }
}
