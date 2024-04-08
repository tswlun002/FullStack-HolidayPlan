package com.tour.dto;

import jakarta.validation.constraints.*;

import java.util.Map;

public record DeleteUserAccount(
        @NotNull(message = "OTP must have exact 4 digits")
        @Min(value = 1000,message = "OTP must have exact 4 digits")
        @Max(value = 9999,message = "OTP must have exact 4 digits")
        //@Pattern(regexp = "[0-9]",message = "OTP must have exact 4 digits")
        Integer OTP,
        @Email(message = "Enter valid email address, e.g tswlun2@gmail.com")
        String username,
        Map<String , String> answers

) {
}
