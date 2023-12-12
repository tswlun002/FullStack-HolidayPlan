package com.tour.dto;

import java.util.List;

public record UserAnswerDTO(
        List<UserSecurityQuestionAnswerDTO> answers
) {
}
