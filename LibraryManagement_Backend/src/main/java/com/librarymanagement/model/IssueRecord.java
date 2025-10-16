package com.librarymanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@Table(name = "issue_records")
public class IssueRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference(value = "user-issues")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    @JsonBackReference
    private Book book;

    @Column(nullable = false)
    private LocalDateTime issueDate = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime dueDate;

    private LocalDateTime returnDate;
}