package com.tour.dto;

import com.tour.model.Permission;
import com.tour.model.Role;
import lombok.Builder;
import java.util.Date;
import java.util.Set;
@Builder
public record UserResponseToAdmin(
        String firstname, String lastname, Date age, String username, Set<Role> roles, Set<Permission> permissions

) {
}
