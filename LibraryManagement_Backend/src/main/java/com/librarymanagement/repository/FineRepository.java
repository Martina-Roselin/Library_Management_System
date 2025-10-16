package com.librarymanagement.repository;

import com.librarymanagement.model.Fine;
import com.librarymanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByUserAndStatus(User user, Fine.Status status);
}