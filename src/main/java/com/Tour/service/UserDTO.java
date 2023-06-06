package com.Tour.service;

import com.Tour.model.UserType;
import lombok.Builder;

import java.time.LocalDate;
import java.util.Date;

@Builder
public record UserDTO(
        String firstname, String lastname, Date age, String username, UserType userType
) {
}
