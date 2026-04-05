package com.lifeledger.service.impl;

import com.lifeledger.domain.CategoryLimit;
import com.lifeledger.repository.CategoryLimitRepository;
import com.lifeledger.service.CategoryLimitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryLimitServiceImpl implements CategoryLimitService {

    private final CategoryLimitRepository categoryLimitRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryLimit> findAll() {
        return categoryLimitRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoryLimit> findById(Long id) {
        return categoryLimitRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoryLimit> findByCategoryName(String categoryName) {
        return categoryLimitRepository.findByCategoryName(categoryName);
    }

    @Override
    @Transactional
    public CategoryLimit save(CategoryLimit categoryLimit) {
        return categoryLimitRepository.save(categoryLimit);
    }

    @Override
    @Transactional
    public CategoryLimit updateLimit(String categoryName, BigDecimal limitAmount) {
        CategoryLimit limit = categoryLimitRepository.findByCategoryName(categoryName)
                .orElseGet(() -> CategoryLimit.builder()
                        .categoryName(categoryName)
                        .limitAmount(limitAmount)
                        .build());
        
        limit.setLimitAmount(limitAmount);
        return categoryLimitRepository.save(limit);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        categoryLimitRepository.deleteById(id);
    }
}
