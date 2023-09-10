package com.tour.service;

import com.tour.dto.RegisterUserRequest;
import com.tour.model.User;
import com.tour.utils.VerificationURL;
import org.springframework.stereotype.Service;

@Service
public interface OnUser {

    boolean saveUser(RegisterUserRequest requester, VerificationURL url);

    User getUser(String username);

    boolean deleteUser(String username);


    boolean deleteRoleFromUser(String username, String roleName);
    User getLoginedUser();
    boolean addNewRoleToUser( String username,String roleName);
    boolean deletePermissionFromUser(String username, String userPermission) ;
    boolean addPermissionToUser(String username, String permissionName) ;

    boolean verifyUser(User user);

}
