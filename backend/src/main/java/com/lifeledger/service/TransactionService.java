package com.lifeledger.service;

import com.lifeledger.dto.request.TransactionRequest;
import com.lifeledger.dto.response.FinanceSummaryResponse;
import com.lifeledger.dto.response.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    TransactionResponse create(TransactionRequest request, Long userId);
    Page<TransactionResponse> findAll(Long userId, Pageable pageable);
    TransactionResponse findById(Long id, Long userId);
    TransactionResponse update(Long id, TransactionRequest request, Long userId);
    void delete(Long id, Long userId);
    FinanceSummaryResponse getSummary(Long userId, int year, int month);
}
