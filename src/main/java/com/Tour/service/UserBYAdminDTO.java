package com.Tour.service;

import com.Tour.model.Role;
import com.Tour.model.UserType;
import lombok.Builder;

import java.util.Date;
import java.util.Set;
@Builder
public record UserBYAdminDTO(
        String firstname, String lastname, Date age, String username, UserType userType, Set<Role> roles

) {
}
