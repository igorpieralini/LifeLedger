package com.lifeledger.controller;

import com.lifeledger.config.SecurityUtils;
import com.lifeledger.dto.response.CsvImportResult;
import com.lifeledger.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Endpoint para importação de extratos bancários em formato CSV.
 * POST /transactions/import  (multipart/form-data, campo "file")
 */
@RestController
@RequestMapping("/transactions/import")
@RequiredArgsConstructor
public class CsvImportController {

    private final CsvImportService csvImportService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<CsvImportResult> importCsv(
            @RequestParam("file") MultipartFile file) {

        Long userId = SecurityUtils.currentUserId();
        CsvImportResult result = csvImportService.importCsv(file, userId);
        return ResponseEntity.ok(result);
    }
}
