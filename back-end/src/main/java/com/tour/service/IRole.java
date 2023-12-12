package com.tour.service;

import com.tour.exception.NotFoundException;
import com.tour.model.*;
import org.springframework.stereotype.Service;
import java.util.Set;

@Service
public interface IRole {
    String[] getNamesDefaultRoles();
    void saveRole(Role role);
    Role getRole(long id);
    Role getRole(String role);
    boolean deleteRole(String role);
    boolean addNewPermissionToRole(String role, String userPermission) throws NotFoundException;
    void deletePermissionFromRoles(Permission permission);
    boolean deletePermissionFromRole(String role, String userPermission);
     Set<Role> getRoles();


}
