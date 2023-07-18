package com.tour.service;

import com.fasterxml.jackson.core.JsonFactoryBuilder;
import com.fasterxml.jackson.core.util.JsonParserDelegate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.tour.dto.EditUserRequest;
import com.tour.dto.RegisterUserRequest;
import com.tour.dto.RoleEvent;
import com.tour.dto.UserEvent;
import com.tour.exception.CatchException;
import com.tour.exception.DuplicateException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.Permission;
import com.tour.model.Role;
import com.tour.model.User;
import com.tour.repository.UserRepository;
import com.tour.utils.Roles;
import io.micrometer.common.util.StringUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import static com.tour.utils.Permissions.*;

@Service
@RequiredArgsConstructor
public class UserService implements OnUser {
    private final UserRepository userRepository;
    private final ApplicationEventPublisher publisher;
    private  final  OnRole onRole;
    private  final  OnPermission onPermission;
    private final Environment environment;

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
        try{
            if(userRepository.count()==0){
                var userDTO = getDefaultUser();
                var role = onRole.getRole(userDTO.usertype().toUpperCase());
                if(role == null) throw new NotFoundException("Role is not found.");
                var user =User.builder().firstname(userDTO.firstname()).lastname(userDTO.lastname())
                        .username(userDTO.username()).
                        password(new BCryptPasswordEncoder().encode(userDTO.password())).
                        age(userDTO.age())
                        .roles(Set.of(role)).build();
                userRepository.save(user);
            }
        }catch (Exception e){
            CatchException.catchException(e);
        }
    }
    /**
     * Save user
     * @param user is the user to be saved
     * @Return true if the is saved
     * @Return  false if the user is not saved
     * @throws  NullPointerException is the user to be saved is null
     */

    @Override
    public boolean saveUser(@Validated User user)
    {
        if(user ==null) throw  new NullException("User is invalid");
        if(getUser(user.getUsername())!=null) throw  new DuplicateException("User exists with username");
        boolean saved = false;
        try {
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            var role  = onRole.getRole(Roles.USER.name());
            if(role==null) throw  new NotFoundException("Role is not found");
            user.getRoles().add(role);
            userRepository.save(user);
            saved=true;
        }catch(Exception e){
            System.out.println(e.getMessage());
            CatchException.catchException(e);
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
        if(user ==null)throw  new NullPointerException("Can not delete null User");
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

    /**
     * Update user details: firstname, lastname, username and password
     * @param user is the new details of the user
     * @return  user  with updated details
     * @throws  NullException all new details are null
     * @throws  NotFoundException if the user is not found
     */
    public Optional<User> updateUserDetails(EditUserRequest user) {
        if (user == null) throw new NullPointerException("User is invalid");
        var user1 = getLoginedUser();
        if (user1 == null) throw new NotFoundException("User is not found");

        StringIsValid isValid = (String value)->(value != null && StringUtils.isNotEmpty(value.trim()) && StringUtils.isNotBlank(value.trim()));

        if(isValid.isValid(user.firstname()) ) user1.setFirstname(user.firstname());
        if(isValid.isValid(user.lastname()) ) user1.setLastname(user.lastname());
        if(isValid.isValid(user.username()) ) user1.setUsername(user.username());
        if(isValid.isValid(user.age().toString()))user1.setAge(user.age());
        if(isValid.isValid(user.newPassword()) ) user1.setPassword(new BCryptPasswordEncoder().encode(user.newPassword()));
        User updatedUser =null;
        try {
            updatedUser =
                    userRepository.save(user1);
        }
         catch (DataIntegrityViolationException e){
            CatchException.catchException(new DuplicateException("User with email already exist"));
         }
        catch (Exception e){
            CatchException.catchException(e);
        }
        return Optional.ofNullable(updatedUser);
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
        Role role = onRole.getRole(roleName);
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
        var permission = onPermission.getPermission(permissionName);
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
