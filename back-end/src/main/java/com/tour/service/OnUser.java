package com.tour.service;

import com.tour.model.*;
import org.springframework.stereotype.Service;

@Service
public interface OnUser {

    boolean saveUser(User user);

    User getUser(String username);

    boolean deleteUser(String username);


    boolean deleteRoleFromUser(String username, String roleName);
    User getLoginedUser();
    boolean addNewRoleToUser( String username,String roleName);


    public boolean deletePermissionFromUser(String username, String userPermission) ;
    public boolean addPermissionToUser( String username,String permissionName) ;
}
