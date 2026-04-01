package com.lifeledger.service.impl;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Extrai e interpreta transações de extratos PDF do Itaú.
 * <p>
 * Formato esperado por linha:
 * {@code 26/03/2026 PIX TRANSF GUSTAVO26/03 -235,00}
 */
public final class ItauPdfParser {

    /** Captura: (data) (descrição) (valor com possível sinal negativo) */
    private static final Pattern TX_PATTERN = Pattern.compile(
            "^(\\d{2}/\\d{2}/\\d{4})\\s+(.+?)\\s+(-?\\d{1,3}(?:\\.\\d{3})*,\\d{2})\\s*$"
    );

    /** Data duplicada no final da descrição, ex: "GUSTAVO26/03" ou "GUSTAVO 26/03" */
    private static final Pattern TRAILING_DATE = Pattern.compile("\\s*\\d{2}/\\d{2}\\s*$");

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /** Linhas a ignorar (case-insensitive substring). */
    private static final List<String> SKIP_KEYWORDS = List.of(
            // Saldos / totalizadores
            "SALDO DO DIA",
            "SALDO ANTERIOR",
            "SALDO DISPONIVEL",
            "SALDO EM CONTA",
            // Cabeçalho da tabela do extrato Itaú
            "LANCAMENTOS",
            "LANÇAMENTOS",
            "EMITIDO EM",
            // Limites
            "LIMITE DE CREDITO",
            "LIMITE DISPONIVEL",
            // Dados da conta
            "AGENCIA",
            "AGÊNCIA",
            "CONTA CORRENTE",
            "BANCO ITAU",
            "BANCO ITAÚ",
            // Metadados do documento
            "EXTRATO",
            "PERIODO",
            "PERÍODO",
            "CPF",
            "CNPJ",
            "PAGINA",
            "PÁGINA",
            "DATA DESCRICAO",
            "DATA DESCRIÇÃO"
    );

    public record ParsedRow(
            LocalDate  date,
            String     description,
            BigDecimal amount,
            int        lineNumber
    ) {}

    public record ParseResult(
            List<ParsedRow> rows,
            List<String>    skippedLines
    ) {}

    // ── Public API ────────────────────────────────────────────────────────────

    public static ParseResult parse(MultipartFile file) throws IOException {
        String rawText = extractText(file);
        return parseLines(rawText);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static String extractText(MultipartFile file) throws IOException {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(doc);
        }
    }

    private static ParseResult parseLines(String text) {
        List<ParsedRow> rows    = new ArrayList<>();
        List<String>    skipped = new ArrayList<>();

        String[] lines = text.split("\\r?\\n");
        int lineNum = 0;

        for (String raw : lines) {
            lineNum++;
            String line = raw.trim();
            if (line.isBlank()) continue;
            if (shouldSkip(line)) continue;

            Matcher m = TX_PATTERN.matcher(line);
            if (!m.matches()) {
                // Linha não corresponde ao padrão — pode ser continuação de descrição
                // longa ou texto institucional; ignora silenciosamente
                continue;
            }

            try {
                LocalDate  date   = LocalDate.parse(m.group(1), DATE_FMT);
                String     desc   = cleanDescription(m.group(2));
                BigDecimal amount = parseAmount(m.group(3));

                if (desc.isBlank()) {
                    skipped.add("Linha " + lineNum + ": descrição vazia após limpeza");
                    continue;
                }

                rows.add(new ParsedRow(date, desc, amount, lineNum));

            } catch (DateTimeParseException | NumberFormatException ex) {
                skipped.add("Linha " + lineNum + ": " + ex.getMessage());
            }
        }

        return new ParseResult(rows, skipped);
    }

    /** Remove data duplicada no final da descrição (ex: "GUSTAVO26/03" → "GUSTAVO"). */
    private static String cleanDescription(String raw) {
        return TRAILING_DATE.matcher(raw).replaceAll("").trim();
    }

    /** Verifica se a linha deve ser ignorada (cabeçalhos, saldos, textos institucionais). */
    private static boolean shouldSkip(String line) {
        String upper = line.toUpperCase();
        for (String kw : SKIP_KEYWORDS) {
            if (upper.contains(kw)) return true;
        }
        return false;
    }

    /**
     * Converte valor no formato Itaú: "-1.234,56" → BigDecimal(-1234.56).
     * O sinal negativo pode estar antes ou depois do valor.
     */
    private static BigDecimal parseAmount(String raw) {
        boolean negative = raw.startsWith("-");
        String s = raw.replace("-", "")    // remove sinal
                      .replace(".", "")    // remove separador de milhar
                      .replace(",", ".");  // vírgula → ponto decimal

        BigDecimal val = new BigDecimal(s).setScale(2, RoundingMode.HALF_UP);
        return negative ? val.negate() : val;
    }

    private ItauPdfParser() {}
}
