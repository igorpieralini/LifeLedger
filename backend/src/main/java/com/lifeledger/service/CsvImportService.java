package com.lifeledger.service;

import com.lifeledger.dto.response.CsvImportResult;
import org.springframework.web.multipart.MultipartFile;

public interface CsvImportService {
    CsvImportResult importCsv(MultipartFile file, Long userId);
}
