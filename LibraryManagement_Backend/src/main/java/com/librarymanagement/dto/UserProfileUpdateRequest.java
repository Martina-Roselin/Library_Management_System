package com.librarymanagement.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String name;
    private String email;
}
