package com.tour.dto;

import jakarta.validation.constraints.Email;
import lombok.NonNull;

public record EmailDTO(
        @NonNull
        String subject,
        @NonNull
        String senderName,
        @NonNull
        String content,
        @NonNull
        @Email String hostMail

) {
}
