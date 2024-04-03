package com.tour.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.NonNull;

public record SecurityEditRequest(
        @Email(message = "Invalid email address, username must be valid email address")
        @NonNull String username,
        @Size(min = 5, max = 1000, message = "Password must contain 5 to 1000 characters.")
        @NonNull String password
) {
}
