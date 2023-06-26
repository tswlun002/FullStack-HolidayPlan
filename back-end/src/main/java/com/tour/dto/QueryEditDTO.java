package com.tour.dto;

import com.tour.model.QueryStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.lang.NonNull;

public record QueryEditDTO(
        @NonNull
        String username,
        @NonNull
        String response,
        @NonNull
        @Enumerated(EnumType.STRING)QueryStatus queryStatus,
        @NonNull

        Long queryId
) {
}
