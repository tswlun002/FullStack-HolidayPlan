package com.tour.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.RequestParam;

public record AdminEditUser(
        @Email(message = "Username must be valid email address") String username,
        @Email(message = "Username must be valid email address") String adminUsername,
        @Size(min = 6,max = 50, message = "Password must be min 6 to max 50 characters")
        String password
) {
}
