package com.lifeledger.service;

import com.lifeledger.dto.request.TransactionRequest;
import com.lifeledger.dto.response.FinanceLimitsResponse;
import com.lifeledger.dto.response.FinanceSummaryResponse;
import com.lifeledger.dto.response.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionService {
    TransactionResponse create(TransactionRequest request, Long userId);
    Page<TransactionResponse> findAll(Long userId, Pageable pageable);
    Page<TransactionResponse> findFiltered(Long userId, String type, Long categoryId,
                                           LocalDate dateFrom, LocalDate dateTo,
                                           BigDecimal minAmount, BigDecimal maxAmount,
                                           Pageable pageable);
    List<TransactionResponse> findAllHistory(Long userId);
    TransactionResponse findById(Long id, Long userId);
    TransactionResponse update(Long id, TransactionRequest request, Long userId);
    void delete(Long id, Long userId);
    FinanceSummaryResponse getSummary(Long userId, int year, int month);
    FinanceLimitsResponse getCategoryLimits(Long userId, int year, int month);
}
