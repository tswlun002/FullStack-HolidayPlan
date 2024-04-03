package com.tour.dto;

import com.tour.model.SecurityQuestion;
import jakarta.validation.constraints.Email;

import java.util.Set;

public record UserSecurityQuestions(
        @Email String username, Set<SecurityQuestion> questions, String message
) {
}
