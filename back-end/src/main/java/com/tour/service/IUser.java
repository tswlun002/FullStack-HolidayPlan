package com.tour.service;

import com.tour.dto.*;
import com.tour.model.User;
import com.tour.utils.VerificationURL;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface IUser {

    boolean saveUser(RegisterUserRequest requester, VerificationURL url);

    User getUser(String username);

    boolean deleteUser(String username);


    boolean deleteRoleFromUser(String username, String roleName);
    User getLoginedUser();
    boolean addNewRoleToUser( String username,String roleName);
    boolean deletePermissionFromUser(String username, String userPermission) ;
    boolean addPermissionToUser(String username, String permissionName) ;

    boolean verifyUser(User user);
    void resetPassword(String username);
    boolean resetPassword(PasswordResetRequest passwordResetRequest);



    boolean updateUserSecurityData(EditUserSecurityData edit);

    void resetUsername(String currentUsername, String username,  Map<Integer, String> answers);

    boolean saveSecurityQuestions(UserSecurityQuestionAnswerDTO securityQuestionDTO);

    boolean checkSecurityEnabled(String username);
}
