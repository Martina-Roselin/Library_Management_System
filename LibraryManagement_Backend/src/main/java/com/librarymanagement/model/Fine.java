package com.librarymanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@Table(name = "fines")
public class Fine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, PAID
    }
}