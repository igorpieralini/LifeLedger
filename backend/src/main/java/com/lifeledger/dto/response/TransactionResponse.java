package com.lifeledger.dto.response;

import com.lifeledger.domain.Transaction;
import com.lifeledger.domain.Transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        TransactionType type,
        BigDecimal amount,
        String description,
        LocalDate date,
        String notes,
        Long categoryId,
        String categoryName,
        String categoryColor,
        LocalDateTime createdAt
) {
    public static TransactionResponse from(Transaction t) {
        var cat = t.getCategory();
        return new TransactionResponse(
                t.getId(), t.getType(), t.getAmount(),
                t.getDescription(), t.getDate(), t.getNotes(),
                cat != null ? cat.getId()    : null,
                cat != null ? cat.getName()  : null,
                cat != null ? cat.getColor() : null,
                t.getCreatedAt()
        );
    }
}
