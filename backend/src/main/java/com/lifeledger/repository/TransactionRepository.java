package com.lifeledger.repository;

import com.lifeledger.domain.Transaction;
import com.lifeledger.domain.Transaction.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByUserIdOrderByDateDescCreatedAtDesc(Long userId, Pageable pageable);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate from, LocalDate to);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    // Financial aggregation for summary/dashboard
    @Query("""
        SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
        WHERE t.user.id = :userId AND t.type = :type
          AND t.date BETWEEN :from AND :to
    """)
    BigDecimal sumByUserIdAndTypeAndDateBetween(Long userId, TransactionType type, LocalDate from, LocalDate to);

    // Overall balance: total income - total expenses
    @Query("""
        SELECT COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE -t.amount END), 0)
        FROM Transaction t WHERE t.user.id = :userId
    """)
    BigDecimal totalBalanceByUserId(Long userId);

    // Category breakdown for pie chart
    @Query("""
        SELECT t.category.name, t.category.color, SUM(t.amount)
        FROM Transaction t
        WHERE t.user.id = :userId AND t.type = 'EXPENSE'
          AND t.date BETWEEN :from AND :to
          AND t.category IS NOT NULL
        GROUP BY t.category.name, t.category.color
        ORDER BY SUM(t.amount) DESC
    """)
    List<Object[]> expensesByCategoryBetween(Long userId, LocalDate from, LocalDate to);

    List<Transaction> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
}
