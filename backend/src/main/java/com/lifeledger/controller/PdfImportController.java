package com.lifeledger.controller;

import com.lifeledger.config.SecurityUtils;
import com.lifeledger.dto.response.CsvImportResult;
import com.lifeledger.service.PdfImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Endpoint para importação de extratos bancários em formato PDF (Itaú).
 * POST /transactions/import/pdf  (multipart/form-data, campo "file")
 */
@RestController
@RequestMapping("/transactions/import/pdf")
@RequiredArgsConstructor
public class PdfImportController {

    private final PdfImportService pdfImportService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<CsvImportResult> importPdf(
            @RequestParam("file") MultipartFile file) {

        Long userId = SecurityUtils.currentUserId();
        CsvImportResult result = pdfImportService.importPdf(file, userId);
        return ResponseEntity.ok(result);
    }
}
