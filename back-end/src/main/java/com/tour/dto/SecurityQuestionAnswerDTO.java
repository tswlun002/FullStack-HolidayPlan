package com.tour.dto;

import com.tour.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.NonNull;

public record SecurityQuestionAnswerDTO(
        @NotBlank(message = "Answer is required")
        @NotEmpty(message = "Answer is required")
        String answer,
        @NonNull
        User user,
        @NonNull
        Integer number
) {
}
