package com.tour.service;

import com.tour.exception.NotFoundException;
import com.tour.model.Permission;
import org.springframework.stereotype.Service;
import java.util.Set;
@Service
public interface IPermission {
    String[]  getNamesDefaultedPermission();
    void save(Permission permission);
    Permission getPermission(String userPermission);
    Set<Permission> getPermissions();
    Permission getPermission(long id);
    boolean deletePermission(long id) throws NotFoundException;
    boolean deletePermission(String userPermission);
}
