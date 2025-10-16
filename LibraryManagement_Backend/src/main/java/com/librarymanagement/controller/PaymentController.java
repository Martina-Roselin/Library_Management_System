package com.librarymanagement.controller;

import com.librarymanagement.dto.PaymentDTO;
import com.librarymanagement.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/fines")
    public ResponseEntity<?> getUserFines() {
        return ResponseEntity.ok(paymentService.getUserFines());
    }

    @PostMapping("/pay")
    public ResponseEntity<?> makePayment(@RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.ok(paymentService.processPayment(paymentDTO));
    }
}