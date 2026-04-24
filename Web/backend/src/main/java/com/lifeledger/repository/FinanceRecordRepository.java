package com.lifeledger.repository;

import com.lifeledger.domain.FinanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FinanceRecordRepository extends JpaRepository<FinanceRecord, Long> {

    Optional<FinanceRecord> findByYearAndMonth(Short year, Short month);

    List<FinanceRecord> findAllByOrderByYearAscMonthAsc();
}
