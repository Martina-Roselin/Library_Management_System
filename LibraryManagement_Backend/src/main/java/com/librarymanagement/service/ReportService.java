package com.librarymanagement.service;

import com.itextpdf.text.DocumentException;
import com.librarymanagement.model.IssueRecord;
import com.librarymanagement.repository.IssueRepository;
import com.librarymanagement.utils.PDFReportGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final IssueRepository issueRepository;
    private final PDFReportGenerator pdfGenerator;

    public byte[] generateIssuanceReport() {
        List<IssueRecord> records = issueRepository.findAll();
        try {
            return pdfGenerator.generateIssuanceReport(records);
        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate issuance report", e);
        }
    }

    public byte[] generateOverdueReport() {
        List<IssueRecord> allRecords = issueRepository.findAll();
        List<IssueRecord> overdueRecords = allRecords.stream()
                .filter(record -> record.getReturnDate() == null && 
                        record.getDueDate().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        try {
            return pdfGenerator.generateIssuanceReport(overdueRecords);
        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate overdue report", e);
        }
    }
}