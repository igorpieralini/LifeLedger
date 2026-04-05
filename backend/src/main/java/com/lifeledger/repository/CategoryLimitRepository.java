package com.lifeledger.repository;

import com.lifeledger.domain.CategoryLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryLimitRepository extends JpaRepository<CategoryLimit, Long> {
    Optional<CategoryLimit> findByCategoryName(String categoryName);
}
