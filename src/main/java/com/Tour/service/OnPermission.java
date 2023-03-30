package com.Tour.service;

import com.Tour.exception.NotFoundException;
import com.Tour.model.Permission;
import com.Tour.model.UserPermission;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public interface OnPermission {

    void save(Permission permission);

    Permission getPermission(UserPermission userPermission);
    Set<Permission> getPermissions();
    Permission getPermission(long id);

    boolean deletePermission(long id) throws NotFoundException;
   // boolean updateAddToPermission(Role role, Set<UserPermission> userPermissions) throws NotFoundException;
    boolean deletePermission(UserPermission userPermission);

    //void deleteRoleForPermission(Role role);
}
