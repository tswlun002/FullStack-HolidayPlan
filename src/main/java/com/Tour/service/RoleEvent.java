package com.Tour.service;
import com.Tour.model.Role;
import com.Tour.model.UserPermission;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Set;
public record RoleEvent(Role role) {
}
