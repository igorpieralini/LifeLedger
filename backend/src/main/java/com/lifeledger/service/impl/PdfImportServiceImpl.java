package com.lifeledger.service.impl;

import com.lifeledger.domain.Category;
import com.lifeledger.domain.Transaction;
import com.lifeledger.domain.Transaction.TransactionType;
import com.lifeledger.domain.User;
import com.lifeledger.dto.response.CsvImportResult;
import com.lifeledger.dto.response.CsvImportResult.ImportedRow;
import com.lifeledger.dto.response.CsvImportResult.SkippedRow;
import com.lifeledger.exception.BusinessException;
import com.lifeledger.repository.CategoryRepository;
import com.lifeledger.repository.TransactionRepository;
import com.lifeledger.repository.UserRepository;
import com.lifeledger.service.PdfImportService;
import com.lifeledger.service.impl.ItauPdfParser.ParseResult;
import com.lifeledger.service.impl.ItauPdfParser.ParsedRow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PdfImportServiceImpl implements PdfImportService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository    categoryRepository;
    private final UserRepository        userRepository;

    @Override
    @Transactional
    public CsvImportResult importPdf(MultipartFile file, Long userId) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Arquivo PDF vazio ou não enviado");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        // Extrai e faz parse do PDF
        ParseResult parsed;
        try {
            parsed = ItauPdfParser.parse(file);
        } catch (Exception ex) {
            throw new BusinessException("Erro ao ler PDF: " + ex.getMessage());
        }

        Map<String, Category> categoryCache = new HashMap<>();
        List<ImportedRow>     imported      = new ArrayList<>();
        List<SkippedRow>      skipped       = new ArrayList<>();
        BigDecimal totalIncome  = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        // Linhas que o parser rejeitou antes de chegar aqui
        for (String msg : parsed.skippedLines()) {
            skipped.add(new SkippedRow(0, msg, "Formato não reconhecido"));
        }

        for (ParsedRow row : parsed.rows()) {
            try {
                TransactionType type = row.amount().compareTo(BigDecimal.ZERO) >= 0
                        ? TransactionType.INCOME : TransactionType.EXPENSE;
                BigDecimal absAmount = row.amount().abs();

                CategoryMatcher.Match match    = CategoryMatcher.match(row.description());
                Category              category = resolveCategory(match, user, categoryCache);

                Transaction tx = Transaction.builder()
                        .user(user)
                        .category(category)
                        .type(type)
                        .amount(absAmount)
                        .description(row.description())
                        .date(row.date())
                        .build();

                transactionRepository.save(tx);

                imported.add(new ImportedRow(
                        row.description(), row.date(), absAmount, type, category.getName()));

                if (type == TransactionType.INCOME) totalIncome  = totalIncome.add(absAmount);
                else                                 totalExpense = totalExpense.add(absAmount);

            } catch (Exception ex) {
                skipped.add(new SkippedRow(row.lineNumber(), row.description(), ex.getMessage()));
            }
        }

        Map<String, Long> byCategory = imported.stream()
                .collect(Collectors.groupingBy(ImportedRow::category, Collectors.counting()));

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new CsvImportResult(
                imported.size() + skipped.size(),
                imported.size(),
                skipped.size(),
                totalIncome,
                totalExpense,
                balance,
                byCategory,
                imported,
                skipped
        );
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Category resolveCategory(CategoryMatcher.Match match, User user,
                                     Map<String, Category> cache) {
        return cache.computeIfAbsent(match.categoryName(), name ->
                categoryRepository.findByNameIgnoreCaseAndUserId(name, user.getId())
                        .orElseGet(() -> categoryRepository.save(
                                Category.builder()
                                        .user(user)
                                        .name(name)
                                        .color(match.color())
                                        .icon(match.icon())
                                        .build()))
        );
    }
}
