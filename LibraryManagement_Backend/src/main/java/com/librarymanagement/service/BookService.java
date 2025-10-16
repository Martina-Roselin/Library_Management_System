package com.librarymanagement.service;

import com.librarymanagement.dto.BookDTO;
import com.librarymanagement.model.Book;
import com.librarymanagement.model.IssueRecord;
import com.librarymanagement.model.User;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.repository.IssueRepository;
import com.librarymanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository; // Inject UserRepository here

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public BookDTO getBook(Long id) {
        return convertToDTO(findBook(id));
    }

    public BookDTO addBook(BookDTO bookDTO) {
        Book book = new Book();
        updateBookFromDTO(book, bookDTO);
        return convertToDTO(bookRepository.save(book));
    }

    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = findBook(id);
        updateBookFromDTO(book, bookDTO);
        return convertToDTO(bookRepository.save(book));
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Transactional
    public IssueRecord issueBook(Long bookId) {
        Book book = findBook(bookId);
        if (!book.isAvailability()) {
            throw new RuntimeException("Book is not available");
        }

        // Get user from Security Context (make sure you cast properly or load from DB)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        IssueRecord issueRecord = new IssueRecord();
        issueRecord.setBook(book);
        issueRecord.setUser(user);
        issueRecord.setDueDate(LocalDateTime.now().plusDays(14));

        book.setAvailability(false);
        bookRepository.save(book);

        return issueRepository.save(issueRecord);
    }

    @Transactional
    public IssueRecord returnBook(Long bookId) {
        Book book = findBook(bookId);

        // Get the username (usually email) from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Load your User entity from the DB by username/email
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        IssueRecord issueRecord = issueRepository.findByBookAndUserAndReturnDateIsNull(book, user)
            .orElseThrow(() -> new RuntimeException("No active issue record found"));

        issueRecord.setReturnDate(LocalDateTime.now());
        book.setAvailability(true);
        bookRepository.save(book);

        return issueRepository.save(issueRecord);
    }

    private Book findBook(Long id) {
        return bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    private BookDTO convertToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setCategory(book.getCategory());
        dto.setAvailability(book.isAvailability());
        return dto;
    }

    private void updateBookFromDTO(Book book, BookDTO dto) {
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setCategory(dto.getCategory());
        book.setAvailability(dto.isAvailability());
    }
}
