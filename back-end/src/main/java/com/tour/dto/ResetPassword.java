package com.tour.dto;

import jakarta.validation.constraints.*;

public record ResetPassword(
        @NotNull(message = "OTP must have exact 4 digits")
        @Min(value = 1000,message = "OTP must have exact 4 digits")
        @Max(value = 9999,message = "OTP must have exact 4 digits")
        //@Pattern(regexp = "[0-9]",message = "OTP must have exact 4 digits")
        Integer OTP,
        @NotBlank(message = "Email address is required")
        @NotEmpty(message = "Email address is required")
        @Size(min = 3, max = 50, message = "Username must contain 3 to 50 characters.")
        @Email(message = "Enter valid email address, e.g tswlun2@gmail.com")
        String currentUsername,
        @NotBlank(message = "password is required")
        @NotEmpty(message = "password is required")
        @Size(min = 5, max = 1000, message = "password must contain 5 to 50 characters.")
        String newPassword
) {
}
