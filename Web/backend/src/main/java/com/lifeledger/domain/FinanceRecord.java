package com.lifeledger.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "finance_records", uniqueConstraints = @UniqueConstraint(columnNames = {"year", "month"}))
@Getter
@Setter
@NoArgsConstructor
public class FinanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Short year;

    @Column(nullable = false)
    private Short month;

    @Column(name = "monthly_income", nullable = false)
    private BigDecimal monthlyIncome = BigDecimal.ZERO;

    @Column(name = "monthly_investment", nullable = false)
    private BigDecimal monthlyInvestment = BigDecimal.ZERO;

    @Column(name = "credit_card_limit", nullable = false)
    private BigDecimal creditCardLimit = BigDecimal.ZERO;

    @Column(name = "debit_card_limit", nullable = false)
    private BigDecimal debitCardLimit = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal debts = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
