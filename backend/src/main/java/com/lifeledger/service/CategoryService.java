package com.lifeledger.service;

import com.lifeledger.dto.request.CategoryRequest;
import com.lifeledger.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse create(CategoryRequest request, Long userId);
    List<CategoryResponse> findAll(Long userId);
    CategoryResponse update(Long id, CategoryRequest request, Long userId);
    void delete(Long id, Long userId);
}
