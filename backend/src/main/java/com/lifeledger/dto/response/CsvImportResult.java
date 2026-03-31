package com.lifeledger.dto.response;

import com.lifeledger.domain.Transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Resultado de uma importação de CSV financeiro.
 */
public record CsvImportResult(
        int totalRows,
        int imported,
        int skipped,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        Map<String, Long> byCategory,
        List<ImportedRow> transactions,
        List<SkippedRow>  skippedRows
) {

    /** Transação importada com sucesso. */
    public record ImportedRow(
            String          description,
            LocalDate       date,
            BigDecimal      amount,
            TransactionType type,
            String          category
    ) {}

    /** Linha ignorada durante o processamento. */
    public record SkippedRow(
            int    line,
            String raw,
            String reason
    ) {}
}
