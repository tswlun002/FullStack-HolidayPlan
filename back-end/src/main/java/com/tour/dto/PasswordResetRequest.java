package com.tour.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
public record PasswordResetRequest(
    int OTP,
    @Email String username,
    @NotBlank(message = "password is required")
    @NotEmpty(message = "password is required")
    @Size(min = 5, max = 1000, message = "password must contain 3 to 50 characters.")
    String newPassword,
    @NotBlank(message = "password is required")
    @NotEmpty(message = "password is required")
    @Size(min = 5, max = 1000, message = "password must contain 3 to 50 characters.")
    String confirmPassword
){



}
