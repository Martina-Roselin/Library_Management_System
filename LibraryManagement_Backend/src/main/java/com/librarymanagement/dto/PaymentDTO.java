package com.librarymanagement.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentDTO {
    private Long fineId;
    private BigDecimal amount;
    private String paymentMethod;
}