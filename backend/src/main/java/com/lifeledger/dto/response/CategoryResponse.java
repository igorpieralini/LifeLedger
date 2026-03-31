package com.lifeledger.dto.response;

import com.lifeledger.domain.Category;
import com.lifeledger.domain.Category.CategoryType;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        String name,
        CategoryType type,
        String color,
        String icon,
        LocalDateTime createdAt
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getType(),
                c.getColor(), c.getIcon(), c.getCreatedAt());
    }
}
