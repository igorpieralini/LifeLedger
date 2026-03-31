package com.lifeledger.service.impl;

import com.lifeledger.domain.Category;
import com.lifeledger.domain.User;
import com.lifeledger.dto.request.CategoryRequest;
import com.lifeledger.dto.response.CategoryResponse;
import com.lifeledger.exception.ResourceNotFoundException;
import com.lifeledger.repository.CategoryRepository;
import com.lifeledger.repository.UserRepository;
import com.lifeledger.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CategoryResponse create(CategoryRequest request, Long userId) {
        User user = getUser(userId);
        Category cat = Category.builder()
                .user(user)
                .name(request.name())
                .type(request.type())
                .color(request.color())
                .icon(request.icon())
                .build();
        return CategoryResponse.from(categoryRepository.save(cat));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll(Long userId) {
        return categoryRepository.findByUserIdOrderByNameAsc(userId)
                .stream().map(CategoryResponse::from).toList();
    }

    @Override
    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request, Long userId) {
        Category cat = getCategory(id, userId);
        cat.setName(request.name());
        cat.setType(request.type());
        cat.setColor(request.color());
        cat.setIcon(request.icon());
        return CategoryResponse.from(categoryRepository.save(cat));
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        Category cat = getCategory(id, userId);
        categoryRepository.delete(cat);
    }

    private Category getCategory(Long id, Long userId) {
        return categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("Category", id));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
    }
}
