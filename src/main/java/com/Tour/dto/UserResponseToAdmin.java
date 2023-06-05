package com.Tour.dto;

import com.Tour.model.Permission;
import com.Tour.model.Role;
import lombok.Builder;
import java.util.Date;
import java.util.Set;
@Builder
public record UserResponseToAdmin(
        String firstname, String lastname, Date age, String username, Set<Role> roles, Set<Permission> permissions

) {
}
