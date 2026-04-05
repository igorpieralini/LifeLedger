package com.lifeledger.service.impl;

import com.lifeledger.domain.Category;
import com.lifeledger.domain.CategoryLimit;
import com.lifeledger.domain.Transaction;
import com.lifeledger.domain.Transaction.TransactionType;
import com.lifeledger.domain.User;
import com.lifeledger.dto.request.TransactionRequest;
import com.lifeledger.dto.response.FinanceLimitsResponse;
import com.lifeledger.dto.response.FinanceSummaryResponse;
import com.lifeledger.dto.response.FinanceSummaryResponse.CategoryBreakdown;
import com.lifeledger.dto.response.TransactionResponse;
import com.lifeledger.exception.ResourceNotFoundException;
import com.lifeledger.repository.CategoryLimitRepository;
import com.lifeledger.repository.CategoryRepository;
import com.lifeledger.repository.TransactionRepository;
import com.lifeledger.repository.UserRepository;
import com.lifeledger.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CategoryLimitRepository categoryLimitRepository;

    @Override
    @Transactional
    public TransactionResponse create(TransactionRequest request, Long userId) {
        User user = getUser(userId);
        Category category = resolveCategory(request.categoryId(), userId);

        Transaction tx = Transaction.builder()
                .user(user)
                .category(category)
                .type(request.type())
                .amount(request.amount())
                .description(request.description())
                .date(request.date())
                .notes(request.notes())
                .build();

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionResponse> findAll(Long userId, Pageable pageable) {
        return transactionRepository
                .findByUserIdOrderByDateDescCreatedAtDesc(userId, pageable)
                .map(TransactionResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> findAllHistory(Long userId) {
        return transactionRepository
                .findByUserIdOrderByDateDescCreatedAtDesc(userId)
                .stream()
                .map(TransactionResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse findById(Long id, Long userId) {
        return TransactionResponse.from(getTransaction(id, userId));
    }

    @Override
    @Transactional
    public TransactionResponse update(Long id, TransactionRequest request, Long userId) {
        Transaction tx = getTransaction(id, userId);
        Category category = resolveCategory(request.categoryId(), userId);

        tx.setCategory(category);
        tx.setType(request.type());
        tx.setAmount(request.amount());
        tx.setDescription(request.description());
        tx.setDate(request.date());
        tx.setNotes(request.notes());

        return TransactionResponse.from(transactionRepository.save(tx));
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        Transaction tx = getTransaction(id, userId);
        transactionRepository.delete(tx);
    }

    @Override
    @Transactional(readOnly = true)
    public FinanceSummaryResponse getSummary(Long userId, int year, int month) {
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());

        BigDecimal income = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.INCOME, from, to);
        BigDecimal expense = transactionRepository
                .sumByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, from, to);
        BigDecimal balance = income.subtract(expense);

        // Category breakdown
        List<Object[]> rows = transactionRepository.expensesByCategoryBetween(userId, from, to);
        List<CategoryBreakdown> breakdown = new ArrayList<>();
        for (Object[] row : rows) {
            String name  = (String)     row[0];
            String color = (String)     row[1];
            BigDecimal total = (BigDecimal) row[2];
            double pct = expense.compareTo(BigDecimal.ZERO) == 0 ? 0 :
                    total.divide(expense, 4, RoundingMode.HALF_UP).doubleValue() * 100;
            breakdown.add(new CategoryBreakdown(name, color, total, pct));
        }

        return new FinanceSummaryResponse(year, month, income, expense, balance, breakdown);
    }

    @Override
    @Transactional(readOnly = true)
    public FinanceLimitsResponse getCategoryLimits(Long userId, int year, int month) {
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());

        List<Object[]> rows = transactionRepository.expensesByCategoryBetween(userId, from, to);
        Map<String, BigDecimal> spentByCategory = new HashMap<>();
        for (Object[] row : rows) {
            String name = (String) row[0];
            BigDecimal spent = (BigDecimal) row[2];
            spentByCategory.put(normalizeCategoryName(name), spent);
        }

        List<CategoryLimit> allLimits = categoryLimitRepository.findAll();
        List<FinanceLimitsResponse.CategoryLimitStatus> status = new ArrayList<>();
        
        for (CategoryLimit limit : allLimits) {
            String categoryName = limit.getCategoryName();
            BigDecimal limitAmount = limit.getLimitAmount();
            BigDecimal spent = spentByCategory.getOrDefault(normalizeCategoryName(categoryName), BigDecimal.ZERO);
            BigDecimal remaining = limitAmount.subtract(spent);
            boolean exceeded = remaining.compareTo(BigDecimal.ZERO) < 0;

            double usedPct = limitAmount.compareTo(BigDecimal.ZERO) <= 0
                    ? 0
                    : spent.divide(limitAmount, 4, RoundingMode.HALF_UP).doubleValue() * 100;

            status.add(new FinanceLimitsResponse.CategoryLimitStatus(
                    categoryName,
                    limitAmount,
                    spent,
                    remaining,
                    Math.max(0, usedPct),
                    exceeded
            ));
        }

        return new FinanceLimitsResponse(year, month, status);
    }

    private String normalizeCategoryName(String name) {
        if (name == null) return "";
        String noAccents = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return noAccents.toLowerCase().trim();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Transaction getTransaction(Long id, Long userId) {
        return transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("Transaction", id));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
    }

    private Category resolveCategory(Long categoryId, Long userId) {
        if (categoryId == null) return null;
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> ResourceNotFoundException.of("Category", categoryId));
    }
}
