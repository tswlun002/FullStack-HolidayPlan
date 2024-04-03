package com.tour.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import java.util.Date;

@Builder
public record UserProfile(
        String firstname, String lastname, @JsonFormat(pattern = "yyyy-MM-dd") Date age, String username, boolean isSecurityEnabled
) {
}
