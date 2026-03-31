package com.lifeledger.service;

import com.lifeledger.dto.response.CsvImportResult;
import org.springframework.web.multipart.MultipartFile;

public interface PdfImportService {
    CsvImportResult importPdf(MultipartFile file, Long userId);
}
