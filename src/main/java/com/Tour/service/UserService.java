package com.Tour.service;

import com.Tour.controller.EditUserRequest;
import com.Tour.exception.CatchException;
import com.Tour.exception.DuplicateException;
import com.Tour.exception.NotFoundException;
import com.Tour.model.Role;
import com.Tour.model.User;
import com.Tour.model.UserRole;
import com.Tour.model.UserType;
import com.Tour.repository.UserRepository;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService implements OnUser {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher publisher;
    private  final  OnRole onRole;



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
        if(user ==null) throw  new NullPointerException("Can not save null User");
        if(getUser(user.getUsername())!=null) throw  new DuplicateException("User exists with  email");
        boolean saved = false;
        try {
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            user.getRoles().add(getRole(user.getUserType()));
            userRepository.save(user);
            saved=true;
        }catch(Exception e){
            CatchException.catchException(e);
        }
        return saved;
    }


    @Override
    public User getUser(long id) {
        return userRepository.getUser(id);
    }


    public Set<User> getUsers(){
        return  userRepository.findAllUser();
    }

    /**
     * Get role  by userType
     * @param userType is the type of the user (Admin or User)
     * @Return role if the userType has role
     * @throws NotFoundException if the userType does not have role
     */

    private  Role getRole(UserType userType) throws NotFoundException {
        Role role= onRole.getRole(UserRole.valueOf(userType.name()));
        if(role==null)throw  new NotFoundException("Role is not found");
        return role;

    }

    @Override
    public User getUser(String userName) {
        return userRepository.getUser(userName);
    }

    @Override
    public List<User> getUsers(LocalDate age) {
        return userRepository.getUsers(age);
    }
    private  void delete(User user){
        userRepository.delete(user);
    }

    @Override
    public boolean deleteUser(String  userName) {
        User user = getUser(userName);
        if(user ==null)throw  new NullPointerException("Can not delete null User");
        boolean deleted = false;
        try {
            publisher.publishEvent(new HolidayPlanEvent(user));
            publisher.publishEvent(new TokenEvent(user));
            delete(user);
            deleted=true;

        }catch (Exception e){CatchException.catchException(e);;}

        return deleted;
    }

    @Override
    public void deleteRoleFromUser(Role role) {
           if(role==null)throw  new NullPointerException("Role is invalid");

           var userIds = userRepository.getUsersByRole(role.getId());
           if (userIds.size() == 0) throw new NotFoundException("There are no users for  role");
         for (var user: userIds) {
             var user1 = userRepository.getUser(user.getId());
             if (user1 != null){
                 userRepository.deleteRoleFromUser(role.getId(), user1.getId());
                 user1.getRoles().remove(role);
                updateUser(user1);
            }
         }


    }



    @Override
    public boolean deleteRoleFromUser(String userName, UserRole userRole) {
        var user = getUser(userName);

        if(user==null )throw  new NotFoundException("User is not found");
        System.out.println(user);
        System.out.println(userRole.name());
        var roles =  user.getRoles().stream().filter(role ->role.getName().name().equals(userRole.name()) ).toList();

        if(roles.size()==0)throw  new NotFoundException("Role is not found");

        boolean deleted  =false;

        try {
            userRepository.deleteRoleFromUser(roles.get(0).getId(), user.getId());
            updateUser(user);
            deleted = true;

        } catch (Exception e) {
            CatchException.catchException(e);
        }
        return deleted;
    }

    @Override
    public User getLoginedUser() {
            String userName= SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            return getUser(userName);

    }

    public  boolean confirmPassword(String currentPassword){
        return     new BCryptPasswordEncoder().matches(currentPassword,getLoginedUser().getPassword());

    }

    @Override
    public boolean addNewRoleToUser(UserRole userRole,String userName)  {
        boolean added =false;
        Role role = onRole.getRole(userRole);
        if(role==null )throw  new NotFoundException("Role is not found");
        var user = getUser(userName);
        if(user==null)throw  new NotFoundException("User is not found");

        if(user.getRoles().contains(role))throw  new DuplicateException(String.format("User already have Role:%s",role.getName().name()));
        try {
            user.getRoles().add(role);
            updateUser(user);
            added=true;

        }catch (Exception e){
            CatchException.catchException(e);
        }

        return added;

    }

    @Override
    public void queryIsUpdated(User user) {

    }

    private  void updateUser(User user) {
        try{
            userRepository.save(user);
        }  catch (Exception e){
            CatchException.catchException(e);
        }
    }
    interface  StringIsValid{
        boolean isValid(String value);
    }

    public Optional<User> updateUserDetails(EditUserRequest user) {
        if (user == null) throw new NullPointerException("User is invalid");
        var user1 = getLoginedUser();
        if (user1 == null) throw new NotFoundException("User is not found");

        StringIsValid isValid = (String value)->(value != null && StringUtils.isNotEmpty(value.trim()) && StringUtils.isNotBlank(value.trim()));

        if(isValid.isValid(user.firstname()) ) user1.setFirstname(user.firstname());
        if(isValid.isValid(user.lastname()) ) user1.setLastname(user.lastname());
        if(isValid.isValid(user.username()) ) user1.setUsername(user.username());
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

            System.out.println("************"+e.toString());
            CatchException.catchException(e);

        }

        return Optional.ofNullable(updatedUser);
    }



}
