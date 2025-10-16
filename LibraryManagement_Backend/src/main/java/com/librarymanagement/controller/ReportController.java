package com.librarymanagement.controller;

import com.librarymanagement.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/issuance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> generateIssuanceReport() {
        byte[] report = reportService.generateIssuanceReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "issuance-report.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(report);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> generateOverdueReport() {
        byte[] report = reportService.generateOverdueReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "overdue-report.pdf");
        
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(report);
    }
}