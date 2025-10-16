package com.librarymanagement.repository;

import com.librarymanagement.model.Book;
import com.librarymanagement.model.IssueRecord;
import com.librarymanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssueRepository extends JpaRepository<IssueRecord, Long> {
    Optional<IssueRecord> findByBookAndUserAndReturnDateIsNull(Book book, User user);
}