package com.librarymanagement.controller;

import com.librarymanagement.dto.PasswordChangeRequest;
import com.librarymanagement.dto.UserProfileUpdateRequest;
import com.librarymanagement.model.IssueRecord;
import com.librarymanagement.model.User;
import com.librarymanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/issues")
    public ResponseEntity<List<IssueRecord>> getUserIssues(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.getUserIssues(user.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserProfileUpdateRequest updatedUser) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.updateProfile(user.getId(), updatedUser));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails, @RequestBody PasswordChangeRequest request) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        userService.changePassword(user.getId(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
