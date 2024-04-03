package com.tour.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.dto.*;
import com.tour.exception.*;
import com.tour.model.Permission;
import com.tour.model.Role;
import com.tour.model.SecurityQuestionAnswer;
import com.tour.model.User;
import com.tour.repository.UserRepository;
import com.tour.utils.Roles;
import com.tour.utils.VerificationURL;
import io.micrometer.common.util.StringUtils;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
@Slf4j
@Service
@RequiredArgsConstructor
@Validated
public class UserService implements IUser {
    private final UserRepository userRepository;
    private final ApplicationEventPublisher publisher;
    private  final IRole iRole;
    private  final IPermission iPermission;
    private final Environment environment;
    private  final ISecurityDataChange securityDataChangeService;
    private  final ISecurityQuestionAnswer iSecurityQuestionAnswer;
    private final PasswordResetBean passwordResetBean;
    private final NewUsernameBean newUsernameBean;


    /**
     * Retrieve the defaulted user
     * @throws  NullException if the details of user are not valid
     * @return default user
     */
    private RegisterUserRequest getDefaultUser(){
        String stringUser = environment.getProperty("user.default.user");
        if(stringUser==null || stringUser.trim().length()<=1)throw  new NullException("Invalid default user");
        if(stringUser.split(",").length<6)throw new NullException("Invalid default user details, all field are required");
        RegisterUserRequest userDTO = null;
        try{
           userDTO= new ObjectMapper().readValue(stringUser,RegisterUserRequest.class);
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if(userDTO==null) throw new NullException("Invalid default user details");
        return userDTO;
    }

    /**
     * Save the default user
     */
    @PostConstruct
    protected void saveDefaultUser(){
        boolean saved = false;
        try{
            if(userRepository.count()==0){
                var userDTO = getDefaultUser();
                var role = iRole.getRole(userDTO.usertype().toUpperCase());
                if(role == null) throw new NotFoundException("Role is not found.");
                var user =User.builder().firstname(userDTO.firstname()).lastname(userDTO.lastname())
                        .username(userDTO.username()).
                        password(new BCryptPasswordEncoder().encode(userDTO.password())).
                        age(userDTO.age())
                        .roles(Set.of(role)).build();
                userRepository.save(user);
                saved=true;
            }
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if(saved){

           log.info("Defaulted user is saved successfully");
        }
        else{
            log.info("Defaulted user is  not saved");
        }
    }
    /**
     * Save user
     * @param user is the user to be saved
     * @param  url is the VerificationURL
     * @Return true if the is saved
     * @Return  false if the user is not saved
     * @throws  NullPointerException is the user to be saved is null
     */

    @Override
    public boolean saveUser(@Validated RegisterUserRequest user,  VerificationURL url)
    {
        if(user ==null) throw  new NullException("User is invalid");
        if(getUser(user.username())!=null) throw  new DuplicateException("User exists with username");
        boolean saved = false;
        User user1 =null;
        try {
             user1  = User.builder().firstname(user.firstname()).lastname(user.lastname())
                    .age(user.age()).username(user.username()).
                    password(new BCryptPasswordEncoder().encode(user.password()))
                    .roles(new HashSet<>()).build();

            var role  = iRole.getRole(Roles.USER.name());
            if(role==null) throw  new NotFoundException("Role is not found");
            user1.getRoles().add(role);
            user1= userRepository.save(user1);
            saved=true;
        }catch(Exception e){
            CatchException.catchException(e);
        }
        if(saved){
            publisher.publishEvent(new RegisterEvent(user1,url.toString()));
        }
        return saved;
    }



    /**
     * Retrieve all users
     * @return Set of  user
     */
    public Set<User> getUsers(){
        return  userRepository.findAllUser();
    }

    /**
     * Retrieve user by username
     * @param username of the user
     * @return User of the given name
     */
    @Override
    public User getUser(String username) {
        return userRepository.getUser(username);
    }

    /**
     * Delete user
     * @param user is the user to delete
     * @Return  true if user is deleted  else false
     */
    private  boolean delete(User user){
        var deleted =false;
        try {
            userRepository.delete(user);
            deleted=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return deleted;
    }

    /**
     * Delete user
     * @param username of the user to delete
     * @return true if user is deleted else false
     * @throws  NullException if user is null
     */
    @Override
    public boolean deleteUser(String  username) {
        User user = getUser(username);
        if(user ==null)throw  new NullPointerException("User is not found");
        boolean deleted = false;
        try {
            var numberRolesToDelete  = user.getRoles().size();
            var deletedRoles = deleteRoles(user);
            var numberPermissionsToDelete  = user.getPermissions().size();
            var deletedPermissions = deletePermission(user);
            publisher.publishEvent(new UserEvent(user));
            deleted = numberPermissionsToDelete==deletedPermissions && numberRolesToDelete==deletedRoles;
            if(deleted)deleted=delete(user);
        }catch (Exception e){CatchException.catchException(e);}
        return deleted;
    }

    /**
     * Delete roles of the user
     * @param user to delete roles from
     * @return number of deleted roles
     */
    private int  deleteRoles(User user){
        AtomicInteger numberDeleted  = new AtomicInteger();
        user.getRoles().forEach(role->
        {
            numberDeleted.addAndGet(
                    userRepository.deleteRoleFromUser(role.getId(), user.getId())
            );

        });
        return  numberDeleted.get();
    }

    /**
     * Delete permission from user
     * @param user to delete permission  from
     * @return number of deleted permissions
     */
    private int  deletePermission(User user){
        AtomicInteger numberDeleted  = new AtomicInteger();
        user.getPermissions().forEach(permission->
        {
            numberDeleted.addAndGet(
                    userRepository.deletePermissionFromUser(permission.getId(), user.getId())
            );

        });
        return  numberDeleted.get();
    }


    /**
     * Update user
     * @param user is the user with new details
     * @return updated user
     */
    private  User updateUser(User user) {
        try{
          user=  userRepository.save(user);
        }  catch (Exception e){
            CatchException.catchException(e);
        }
        return user;
    }

    /**
     * Check if the given string is valid
     */
    private interface  StringIsValid{
        boolean isValid(String value);
    }
    StringIsValid isValid = (String value)->(value != null && StringUtils.isNotEmpty(value.trim()) && StringUtils.isNotBlank(value.trim()));


    /**
     * Update user details: firstname, lastname, username and password
     * @param user is the new details of the user
     * @return  user  with updated details
     * @throws  NullException all new details are null
     * @throws  NotFoundException if the user is not found
     */
    public boolean updateUserDetails(@Valid EditUserNoneSecurityData user) {
        if (user == null) throw new NullPointerException("User is invalid");
        var user1 = getUser(user.currentUsername());
        if (user1 == null) throw new NotFoundException("User is not found");
        if(isValid.isValid(user.firstname()) ) user1.setFirstname(user.firstname());
        if(isValid.isValid(user.lastname()) ) user1.setLastname(user.lastname());
        if(user.age()!=null &&isValid.isValid(user.age().toString()))
            user1.setAge(user.age());
        var updatedUser =false;
        try {
            userRepository.save(user1);
            updatedUser =true;
        }
         catch (DataIntegrityViolationException e){
            CatchException.catchException(new DuplicateException("User with email already exist"));
         }
        catch (Exception e){
            CatchException.catchException(e);
        }
        return updatedUser;
    }

    /**
     * Add role to user
     * @param username of the user
     * @param roleName of the role to add to user
     * @Return  true if role added to user
     * @Return  false if role failed to add to user
     * @throws  NotFoundException if user/role is not found
     * @throws  DuplicateException if role already added to user
     */
    @Override
    public boolean addNewRoleToUser(String username, String  roleName)  {
        var user = getUser(username);
        if(user==null)throw  new NotFoundException("User is not found");
        Role role = iRole.getRole(roleName);
        if(role==null )throw  new NotFoundException("Role is not found");
        if(user.getRoles().contains(role))throw  new DuplicateException(String.format("User already have Role:%s",role.getName()));
        boolean added =false;
        try {
            user.getRoles().add(role);
            added= updateUser(user)!=null;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return added;
    }

    /**
     * Delete Role from user
     * @param role  to deleted
     * @throws  NullException if role null
     * @throws  RuntimeException if role is not deleted
     */

    protected void deleteRoleFromUser(Role role) {
        if(role==null)throw  new NullException("Role is invalid");
        var users = userRepository.getUsersByRole(role.getName());
       try {
           for (var user : users) {
               var deleted = userRepository.deleteRoleFromUser(role.getId(), user.getId())==1;
               if (deleted) {
                   user.getRoles().remove(role);
                   deleted=updateUser(user)!=null;
               }

              if(!deleted) throw new RuntimeException("Failed delete role: "+role.getName());
           }
       }catch (Exception e){
           CatchException.catchException(e);
       }
    }

    /***
     * Delete role from user by username and role name
     * @param username of the user to delete role from
     * @param roleName  of the role to delete
     * @return true if role deleted else false
     */
    @Override
    public boolean deleteRoleFromUser(String username, String roleName) {
        var user = getUser(username);
        if(user==null )throw  new NotFoundException("User is not found");
        var roles =  user.getRoles().stream().filter(role ->role.getName().equals(roleName) ).toList();
        if(roles.isEmpty())throw  new NotFoundException("Role is not found");
        boolean deleted  =false;
        try {
            deleted =userRepository.deleteRoleFromUser(roles.get(0).getId(), user.getId())==1;
            if(deleted){
                deleted=updateUser(user)!=null;
            }
        } catch (Exception e) {
            CatchException.catchException(e);
        }
        return deleted;
    }

    /**
     * Retrieve logged-in user
     * @Return user logged-in if there is logged-in user
     * @Return  anonymous  user if no logged-in user
     */
    @Override
    public User getLoginedUser() {
        String userName= SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return getUser(userName);

    }

    /**
     * Confirm given password is equals password of the current logged-in user
     * @param currentPassword is the password to compare with password of logged-in user
     * @return true if the passwords are equal else false;
     */
    public  boolean confirmPassword(String currentPassword){
        return     new BCryptPasswordEncoder().matches(currentPassword,getLoginedUser().getPassword());

    }

    /**
     * Add permission to user
     *
     * @param permissionName of the permission to delete
     * @param username of the user delete permission from
     * @Return True if the permission is deleted
     * @Return False  if the permission is not deleted
     * @throws  NotFoundException if no user of given username does not exist
     * @throws  NotFoundException if no permission  of given permission does not exist
     */
    @Override
    public boolean addPermissionToUser( String username,String permissionName)  {
        var user = getUser(username);
        if(user==null)throw  new NotFoundException("User is not found");
        var permission = iPermission.getPermission(permissionName);
        if(permission==null )throw  new NotFoundException("Permission is not found");
        boolean added =false;
        if(user.getPermissions().contains(permission))throw  new DuplicateException(String.format("User already have Role:%s",permission.getName()));
        try {
            user.getPermissions().add(permission);
            added = updateUser(user)!=null;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return added;
    }

    /**
     * Verifies user account
     * @param user is the user to verify
     * @throws  NullException if the user to verify is null
     * @return true when verified successfully otherwise false
     */
    @Override
    public boolean verifyUser(User user) {
        if(user==null)throw  new NullException("User is invalid");
        var isVerified=false;
        try{
            user.setEnabled(true);
            userRepository.save(user);
            isVerified=true;
        }
        catch (Exception e){
            CatchException.catchException(e);
        }
        return  isVerified;
    }

    @Override
    public void resetPassword(String username,String newPassword) {
        var user = getUser(username);
        if(user==null)throw  new NotFoundException("User is not found with given email.");
        publisher.publishEvent( new SecurityChangeDataEvent(user, user.getUsername()));
        passwordResetBean.setNewPassword(newPassword);
        passwordResetBean.setEmail(username);
    }

    /**
     * Updates password of the user
     * @param passwordResetRequest  is the object that contains new password, confirm password and username
     * @throws  InvalidCredentials if  new password and confirm password are not the equal
     * @throws NotFoundException if the given username is not found
     * @throws  InvalidToken is the provided OTP is not valid or can not be verified
     * @return tru if password is changed successful else false
     */

    @Override
    public boolean resetPassword(@NonNull PasswordResetRequest passwordResetRequest) {
        if(!Objects.equals(passwordResetRequest.confirmPassword(), passwordResetRequest.newPassword()))
            throw  new InvalidCredentials("Passwords are not the same.");
        var user = getUser(passwordResetRequest.username());
        if(user==null)throw  new NotFoundException("User is not found");
        if(!securityDataChangeService.verify(
                passwordResetRequest.OTP(), passwordResetRequest.username(),
                new SecurityChangeDataEvent(user, passwordResetRequest.username()))){
            throw  new InvalidToken("Failed to verify OTP");
        }

        if(isValid.isValid(passwordResetRequest.newPassword()) )
            user.setPassword(new BCryptPasswordEncoder().encode(passwordResetRequest.newPassword()));

        var isUpdated =false;
        try{
            userRepository.save(user);
            isUpdated=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }

        return isUpdated;
    }
    private boolean updateUserSecurityData(EditUserSecurityData edit) {

        if (edit == null) throw new NullPointerException("Invalid edit details");

        var user1 = getUser(edit.currentUsername());
        if (user1 == null) throw new NotFoundException("User is not found");
        if(! securityDataChangeService.verify(edit.OTP(), edit.currentUsername(),
                new SecurityChangeDataEvent(user1,edit.currentUsername()))){

            throw  new InvalidToken("Failed to verify  OTP");
        }
        if(!isValid.isValid(edit.username()) && !isValid.isValid(edit.newPassword()) )
            throw  new NullException("No new data to update");
        if(isValid.isValid(edit.username()) ) user1.setUsername(edit.username());
        if(isValid.isValid(edit.newPassword())||isValid.isValid(passwordResetBean.getNewPassword()) )
            user1.setPassword(new BCryptPasswordEncoder().encode(edit.newPassword()));
        var updatedUser =false;
        try {
            userRepository.save(user1);
            updatedUser =true;
        }
        catch (DataIntegrityViolationException e){
            CatchException.catchException(new DuplicateException("User with email already exist"));
        }
        catch (Exception e){
            CatchException.catchException(e);
        }
        return updatedUser;
    }

    @Override
    public void resetUsername(String username, String newUsername, Map<String, String> answers) {
        var user = getUser(username);
        if(user==null)throw  new NotFoundException("User is not found with given email.");
        if(checkSecurityEnabled(user.getUsername())){
             if(!iSecurityQuestionAnswer
                     .checkAnswers(username,answers
                             )){
                 throw  new InvalidCredentials("Incorrect security answers to security questions");
             }
        }
        publisher.publishEvent( new SecurityChangeDataEvent(user, newUsername));
    }

    @Override
    public boolean saveSecurityQuestions(UserSecurityQuestionAnswerDTO securityQuestionDTO) {
        var user = getUser(securityQuestionDTO.username());
        if(user==null)throw  new NotFoundException("User is not found");
        var isSaved =false;
        isSaved= iSecurityQuestionAnswer.save(new SecurityQuestionAnswerDTO(  securityQuestionDTO.answer(),
                user,securityQuestionDTO.number()));


        return isSaved ;
    }

    @Override
    public boolean checkSecurityEnabled(String username) {
        return !iSecurityQuestionAnswer.findByUsername(username).isEmpty();
    }

    @Override
    public boolean changePassword(ResetPassword edit) {
        return updateUserSecurityData(
                new EditUserSecurityData(
                        edit.OTP(),
                       null,
                        edit.newPassword(),
                        edit.currentUsername()
                )
        );
    }

    @Override
    public boolean changeUsername(ResetUsername edit) {
        if(checkSecurityEnabled(edit.username())){
            if(!iSecurityQuestionAnswer.checkAnswers(edit.username(),edit.answers())){
                throw  new InvalidCredentials("Incorrect security answers to some security questions");
            }
        }
        return updateUserSecurityData(
                new EditUserSecurityData(
                        edit.OTP(),
                        edit.newUsername(),
                        null,
                        edit.username()
                )
        );
    }

    @Override
    public Set<SecurityQuestionAnswer> resetUsername(String username, String newUsername) {
        if(getUser(newUsername)!=null)throw new DuplicateException("User with given username already exist.");
        var user = getUser(username);
        if(user==null)throw  new NotFoundException("User is not found with given email.");
        var answerQuestions = iSecurityQuestionAnswer.findByUsername(username);
        if(checkSecurityEnabled(user.getUsername())){
            publisher.publishEvent( new SecurityChangeDataEvent(user,newUsername));
        }
        newUsernameBean.setUsername(newUsername);
        return answerQuestions;
    }



    /**
     * Delete permission from user
     * @param permission to from user
     * @throws  NullException if permission is null
     * @throws  RuntimeException if permission is not deleted
     */

    protected void deletePermissionFromUser(Permission permission) {
        if(permission==null)throw  new NullPointerException("Permission is invalid");
        var users = userRepository.getUsersByPermission(permission.getName());
        try {
            for (var user : users) {
                var deleted = userRepository.deletePermissionFromUser(permission.getId(), user.getId()) == 1;
                if (deleted) {
                    user.getPermissions().remove(permission);
                    deleted=updateUser(user)!=null;
                }
                if(!deleted)throw new RuntimeException("Failed to delete permission");
            }
        }
        catch (Exception e){
            CatchException.catchException(e);
        }
    }

    /**
     * Delete permission from user
     * @param username of the user to delete permission from
     * @param  permissionName of the permission to delete
     * @Return true if permission is deleted from user
     * @Return  false if permission is not deleted  from user
     * @throws  NotFoundException if user/permission is not found
     */
    @Override
    public boolean deletePermissionFromUser(String username, String permissionName) {
        var user = getUser(username);
        if(user==null )throw  new NotFoundException("User is not found");
        var permissions =  user.getPermissions().stream().filter(permission ->
                permission.getName().equals(permissionName) ).toList();
        if(permissions.isEmpty())throw  new NotFoundException("Permission is not found");
        boolean deleted  =false;
        try {
            deleted=userRepository.deletePermissionFromUser(permissions.get(0).getId(), user.getId())==1;
            if( deleted)deleted=updateUser(user)!=null;
        } catch (Exception e) {
            CatchException.catchException(e);
        }
        return deleted;
    }

}
