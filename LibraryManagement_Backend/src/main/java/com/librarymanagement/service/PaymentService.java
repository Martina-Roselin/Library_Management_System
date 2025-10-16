package com.librarymanagement.service;

import com.librarymanagement.dto.PaymentDTO;
import com.librarymanagement.model.Fine;
import com.librarymanagement.model.User;
import com.librarymanagement.repository.FineRepository;
import com.librarymanagement.repository.UserRepository;
import com.librarymanagement.utils.EmailService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final FineRepository fineRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    public List<Fine> getUserFines() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // safer
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return fineRepository.findByUserAndStatus(user, Fine.Status.PENDING);
    }


    @Transactional
    public Fine processPayment(PaymentDTO paymentDTO) {
        Fine fine = fineRepository.findById(paymentDTO.getFineId())
            .orElseThrow(() -> new RuntimeException("Fine not found"));

        if (fine.getStatus() == Fine.Status.PAID) {
            throw new RuntimeException("Fine is already paid");
        }

        if (!fine.getAmount().equals(paymentDTO.getAmount())) {
            throw new RuntimeException("Payment amount does not match fine amount");
        }

        fine.setStatus(Fine.Status.PAID);
        Fine savedFine = fineRepository.save(fine);

        emailService.sendPaymentConfirmation(fine.getUser().getEmail(), fine);

        return savedFine;
    }
}