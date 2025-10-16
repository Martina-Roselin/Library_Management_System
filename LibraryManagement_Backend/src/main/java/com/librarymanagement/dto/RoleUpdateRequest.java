package com.librarymanagement.dto;

import com.librarymanagement.model.User;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    private User.Role role;
}