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
import com.lifeledger.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CsvImportServiceImpl implements CsvImportService {

    private static final DateTimeFormatter BR_DATE  = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ISO_LOCAL_DATE;

    private final TransactionRepository transactionRepository;
    private final CategoryRepository    categoryRepository;
    private final UserRepository        userRepository;

    private record CsvRow(int lineNum, String raw, LocalDate date, String desc, BigDecimal amount) {}

    @Override
    @Transactional
    public CsvImportResult importCsv(MultipartFile file, Long userId) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Arquivo CSV vazio ou não enviado");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        List<CsvRow>     validRows = new ArrayList<>();
        List<SkippedRow> skipped   = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String  line;
            int     lineNum       = 0;
            boolean headerSkipped = false;

            while ((line = reader.readLine()) != null) {
                lineNum++;
                line = line.trim();
                if (line.isBlank()) continue;

                if (!headerSkipped) {
                    headerSkipped = true;
                    if (isHeaderLine(line)) continue;
                }

                try {
                    String[] cols = parseLine(line);
                    if (cols.length < 3) {
                        skipped.add(new SkippedRow(lineNum, line,
                                "Colunas insuficientes — esperado: Data, Descrição, Valor"));
                        continue;
                    }

                    LocalDate  date   = parseDate(cols[0].trim());
                    String     desc   = cols[1].trim();
                    BigDecimal amount = parseAmount(cols[2].trim());

                    if (desc.isBlank()) {
                        skipped.add(new SkippedRow(lineNum, line, "Descrição vazia"));
                        continue;
                    }

                    validRows.add(new CsvRow(lineNum, line, date, desc,
                            amount.abs().setScale(2, RoundingMode.HALF_UP)));

                } catch (Exception ex) {
                    skipped.add(new SkippedRow(lineNum, line, ex.getMessage()));
                }
            }

        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException("Erro ao processar arquivo: " + ex.getMessage());
        }

        Set<String> existing = buildExistingFingerprints(user.getId(), validRows);

        Map<String, Category> categoryCache = new HashMap<>();
        List<ImportedRow>     imported      = new ArrayList<>();
        int        duplicates   = 0;
        BigDecimal totalIncome  = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (CsvRow row : validRows) {
            try {
                String fp = fingerprint(row.date(), row.desc(), row.amount());
                if (existing.contains(fp)) {
                    duplicates++;
                    continue;
                }

                TransactionType type = row.amount().compareTo(BigDecimal.ZERO) >= 0
                        ? TransactionType.INCOME : TransactionType.EXPENSE;

                CategoryMatcher.Match match    = CategoryMatcher.match(row.desc());
                Category              category = resolveCategory(match, user, categoryCache);

                transactionRepository.save(Transaction.builder()
                        .user(user)
                        .category(category)
                        .type(type)
                        .amount(row.amount())
                        .description(row.desc())
                        .date(row.date())
                        .build());

                existing.add(fp);

                imported.add(new ImportedRow(row.desc(), row.date(), row.amount(), type, category.getName()));

                if (type == TransactionType.INCOME) totalIncome  = totalIncome.add(row.amount());
                else                                 totalExpense = totalExpense.add(row.amount());

            } catch (Exception ex) {
                skipped.add(new SkippedRow(row.lineNum(), row.raw(), ex.getMessage()));
            }
        }

        Map<String, Long> byCategory = imported.stream()
                .collect(Collectors.groupingBy(ImportedRow::category, Collectors.counting()));

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new CsvImportResult(
                imported.size() + duplicates + skipped.size(),
                imported.size(),
                duplicates,
                skipped.size(),
                totalIncome,
                totalExpense,
                balance,
                byCategory,
                imported,
                skipped
        );
    }


    private Set<String> buildExistingFingerprints(Long userId, List<CsvRow> rows) {
        if (rows.isEmpty()) return new HashSet<>();

        LocalDate from = rows.stream().map(CsvRow::date).min(LocalDate::compareTo).get();
        LocalDate to   = rows.stream().map(CsvRow::date).max(LocalDate::compareTo).get();

        Set<String> fps = new HashSet<>();
        transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, from, to)
                .forEach(t -> fps.add(fingerprint(t.getDate(), t.getDescription(), t.getAmount())));
        return fps;
    }

    private static String fingerprint(LocalDate date, String description, BigDecimal amount) {
        return date + "|" + description.toLowerCase() + "|" + amount.toPlainString();
    }

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

    private boolean isHeaderLine(String line) {
        String upper = line.toUpperCase();
        return upper.contains("DATA") || upper.contains("DATE")
                || upper.contains("DESCR") || upper.contains("VALOR");
    }

    private String[] parseLine(String line) {
        char sep = line.contains(";") ? ';' : ',';
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == sep && !inQuotes) {
                fields.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        fields.add(current.toString());
        return fields.toArray(String[]::new);
    }

    private LocalDate parseDate(String raw) {
        try { return LocalDate.parse(raw, BR_DATE); }
        catch (DateTimeParseException ignored) {}
        try { return LocalDate.parse(raw, ISO_DATE); }
        catch (DateTimeParseException ignored) {}
        throw new IllegalArgumentException("Data inválida: \"" + raw + "\"");
    }

    private BigDecimal parseAmount(String raw) {
        String s = raw.replaceAll("[^\\d.,\\-]", "").trim();
        if (s.isBlank()) throw new IllegalArgumentException("Valor vazio");

        if (s.matches("-?\\d{1,3}(\\.\\d{3})*(,\\d{1,2})?") && s.contains(",")) {
            s = s.replace(".", "").replace(",", ".");
        }
        else if (s.matches("-?\\d+,\\d{1,2}")) {
            s = s.replace(",", ".");
        }
        else {
            s = s.replace(",", "");
        }

        try {
            return new BigDecimal(s);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Valor inválido: \"" + raw + "\"");
        }
    }
}
