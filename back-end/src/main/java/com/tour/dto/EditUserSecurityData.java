package com.tour.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.NonNull;

public record EditUserSecurityData(
     Integer OTP,
    @NotBlank(message = "lastName is required")
    @NotEmpty(message = "lastName is required")
    @Size(min = 3, max = 50, message = "lastName must contain 3 to 50 characters.")
    @Email
    String username,
    @NotBlank(message = "password is required")
    @NotEmpty(message = "password is required")
    @Size(min = 5, max = 1000, message = "password must contain 3 to 50 characters.")
    String newPassword,
    @NonNull
    @NotBlank(message = "lastName is required")
    @NotEmpty(message = "lastName is required")
    @Size(min = 3, max = 50, message = "lastName must contain 3 to 50 characters.")
    @Email
    String currentUsername
 ){

}


