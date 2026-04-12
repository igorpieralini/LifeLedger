package com.lifeledger.dto.response;

import com.lifeledger.domain.Transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record CsvImportResult(
        int totalRows,
        int imported,
        int duplicates,   // já existiam no banco — ignorados sem erro
        int skipped,      // falha de parse ou dado inválido
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        Map<String, Long> byCategory,
        List<ImportedRow> transactions,
        List<SkippedRow>  skippedRows
) {

    public record ImportedRow(
            String          description,
            LocalDate       date,
            BigDecimal      amount,
            TransactionType type,
            String          category
    ) {}

    public record SkippedRow(
            int    line,
            String raw,
            String reason
    ) {}
}
