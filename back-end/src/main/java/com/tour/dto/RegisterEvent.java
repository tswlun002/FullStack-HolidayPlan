package com.tour.dto;

import com.tour.model.User;

public record RegisterEvent(
        User user,
        String url
) {
}
