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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

        private record DefaultCategory(String name, Category.CategoryType type, String color, String icon) {}

        private static final List<DefaultCategory> DEFAULT_CATEGORIES = List.of(
            new DefaultCategory("Salário", Category.CategoryType.FIXED, "#10b981", "payments"),
            new DefaultCategory("Investimentos", Category.CategoryType.VARIABLE, "#0d9488", "trending_up"),
            new DefaultCategory("Outros Ganhos", Category.CategoryType.VARIABLE, "#059669", "attach_money"),
            new DefaultCategory("Transferências", Category.CategoryType.VARIABLE, "#94a3b8", "swap_horiz"),
            new DefaultCategory("Mercado", Category.CategoryType.VARIABLE, "#d97706", "shopping_cart"),
            new DefaultCategory("Restaurante", Category.CategoryType.VARIABLE, "#f59e0b", "restaurant"),
            new DefaultCategory("Transporte Público", Category.CategoryType.VARIABLE, "#818cf8", "directions_bus"),
            new DefaultCategory("App de Transporte", Category.CategoryType.VARIABLE, "#6366f1", "local_taxi"),
            new DefaultCategory("Combustível", Category.CategoryType.VARIABLE, "#4f46e5", "local_gas_station"),
            new DefaultCategory("Educação", Category.CategoryType.FIXED, "#6366f1", "school"),
            new DefaultCategory("Saúde", Category.CategoryType.FIXED, "#10b981", "health_and_safety"),
            new DefaultCategory("Fatura do cartão", Category.CategoryType.FIXED, "#fb7185", "credit_card"),
            new DefaultCategory("Boletos", Category.CategoryType.FIXED, "#f97316", "receipt"),
            new DefaultCategory("Taxas Bancárias", Category.CategoryType.VARIABLE, "#f43f5e", "account_balance"),
            new DefaultCategory("Compras Online", Category.CategoryType.VARIABLE, "#ec4899", "shopping_bag"),
            new DefaultCategory("Vestuário", Category.CategoryType.VARIABLE, "#f472b6", "checkroom"),
            new DefaultCategory("Streaming", Category.CategoryType.VARIABLE, "#a855f7", "movie"),
            new DefaultCategory("Lazer / Entretenimento", Category.CategoryType.VARIABLE, "#9333ea", "local_activity"),
            new DefaultCategory("Outros itens", Category.CategoryType.VARIABLE, "#6b7280", "category")
        );

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
    @Transactional
    public List<CategoryResponse> findAll(Long userId) {
        User user = getUser(userId);
        ensureDefaultCategories(user);
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

    private void ensureDefaultCategories(User user) {
        for (DefaultCategory def : DEFAULT_CATEGORIES) {
            Optional<Category> existing = categoryRepository.findByNameIgnoreCaseAndUserId(def.name(), user.getId());
            if (existing.isPresent()) continue;

            categoryRepository.save(Category.builder()
                    .user(user)
                    .name(def.name())
                    .type(def.type())
                    .color(def.color())
                    .icon(def.icon())
                    .build());
        }
    }
}
