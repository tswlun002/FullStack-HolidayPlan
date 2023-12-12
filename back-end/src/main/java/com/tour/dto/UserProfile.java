package com.tour.dto;

import lombok.Builder;

import java.util.Date;

@Builder
public record UserProfile(
        String firstname, String lastname, Date age, String username,boolean isSecurityEnabled
) {
}
