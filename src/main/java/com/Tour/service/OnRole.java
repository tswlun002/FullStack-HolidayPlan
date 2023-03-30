package com.Tour.service;

import com.Tour.exception.NotFoundException;
import com.Tour.model.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public interface OnRole {

    void saveRole(Role role);

    Role getRole(long id);
    Role getRole(UserRole userRole);
    boolean deleteRole(UserRole userRole);
    boolean addNewPermissionToRole(UserRole userRole, UserPermission userPermission) throws NotFoundException;

    void addPermissionToRole(Permission permission);
    void deletePermissionFromRoles(Permission permission);
    boolean deletePermissionFromRole(UserRole userRole, UserPermission userPermission);

     Set<Role> getRoles();


}
