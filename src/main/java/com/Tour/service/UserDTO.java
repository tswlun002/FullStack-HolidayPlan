package com.Tour.service;

import com.Tour.model.UserType;
import lombok.Builder;

@Builder
public record UserDTO(
        String firstname, String lastname, int age, String username, UserType userType
) {
}
