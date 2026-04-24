package com.lifeledger.service;

import com.lifeledger.domain.FinanceRecord;
import com.lifeledger.dto.FinanceRecordRequest;
import com.lifeledger.dto.FinanceRecordResponse;
import com.lifeledger.repository.FinanceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FinanceRecordService {

    private final FinanceRecordRepository repository;

    public Optional<FinanceRecordResponse> getByMonth(Short year, Short month) {
        return repository.findByYearAndMonth(year, month)
                .map(FinanceRecordResponse::from);
    }

    public List<FinanceRecordResponse> listAll() {
        return repository.findAllByOrderByYearAscMonthAsc().stream()
                .map(FinanceRecordResponse::from)
                .toList();
    }

    @Transactional
    public FinanceRecordResponse save(FinanceRecordRequest request) {
        FinanceRecord record = repository.findByYearAndMonth(request.year(), request.month())
                .orElseGet(FinanceRecord::new);

        record.setYear(request.year());
        record.setMonth(request.month());
        record.setMonthlyIncome(request.monthlyIncome());
        record.setMonthlyInvestment(request.monthlyInvestment());
        record.setCreditCardLimit(request.creditCardLimit());
        record.setDebitCardLimit(request.debitCardLimit());
        record.setDebts(request.debts());

        return FinanceRecordResponse.from(repository.save(record));
    }
}
