package com.tour.service;

import com.tour.dto.*;
import com.tour.model.SecurityQuestionAnswer;
import com.tour.model.User;
import com.tour.utils.VerificationURL;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public interface IUser {

    boolean saveUser(RegisterUserRequest requester, VerificationURL url);
    User getUser(String username);
    boolean deleteUser(DeleteUserAccount deleteUserAccount);
    Set<SecurityQuestionAnswer>  reuqestToDeleteUserAccount(String username);
    boolean deleteRoleFromUser(String username, String roleName);
    User getLoginedUser();
    boolean addNewRoleToUser( String username,String roleName);
    boolean deletePermissionFromUser(String username, String userPermission) ;
    boolean addPermissionToUser(String username, String permissionName) ;
    boolean verifyUser(User user);
    void resetPassword(String username,String newPassword);
    boolean resetPassword(PasswordResetRequest passwordResetRequest);
    void resetUsername(String currentUsername, String username, Map<String, String> answers);
    boolean saveSecurityQuestions(UserSecurityQuestionAnswerDTO securityQuestionDTO);
    boolean checkSecurityEnabled(String username);
    boolean changePassword(ResetPassword edit);
    boolean changeUsername(ResetUsername edit);
    Set<SecurityQuestionAnswer> resetUsername(String username,String newUsername);

    boolean deleteUserByAdmin(AdminEditUser adminEditUser);
    boolean deleteUser(String username);
}
