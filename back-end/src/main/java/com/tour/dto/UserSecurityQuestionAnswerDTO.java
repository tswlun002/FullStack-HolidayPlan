package com.tour.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.NonNull;

public record UserSecurityQuestionAnswerDTO(
        @NotBlank(message = "Answer is required")
        @NotEmpty(message = "Answer is required")
        String answer,
        @NotBlank(message = "username is required")
        @NotEmpty(message = "username is required")
        @Size(min = 3, max = 50, message = "username must contain 3 to 50 characters.")
        String username,
        @NonNull
        Integer number
) {
}
