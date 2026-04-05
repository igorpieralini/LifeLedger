package com.lifeledger.service;

import com.lifeledger.domain.CategoryLimit;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CategoryLimitService {
    List<CategoryLimit> findAll();
    Optional<CategoryLimit> findById(Long id);
    Optional<CategoryLimit> findByCategoryName(String categoryName);
    CategoryLimit save(CategoryLimit categoryLimit);
    CategoryLimit updateLimit(String categoryName, BigDecimal limitAmount);
    void deleteById(Long id);
}
