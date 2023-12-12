package com.tour.dto;

import lombok.NonNull;

public record SecurityEditRequest(
        @NonNull String username,
        @NonNull String password
) {
}
