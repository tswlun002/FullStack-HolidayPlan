package com.tour.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.NonNull;
import java.util.Map;

public record ResetUsername(
        Integer OTP,
        @NotBlank(message = "username is required")
        @NotEmpty(message = "username is required")
        @Size(min = 3, max = 50, message = "username must contain 3 to 50 characters.")
        @Email(message = "Enter valid email address, e.g tswlun2@gmail.com")
        String username,
        @NonNull
        @NotBlank(message = "username is required")
        @NotEmpty(message = "username is required")
        @Size(min = 3, max = 50, message = "username must contain 3 to 50 characters.")
        @Email(message = "Enter valid email address, e.g tswlun2@gmail.com")
        String newUsername,
        Map<String , String> answers

) {
}
