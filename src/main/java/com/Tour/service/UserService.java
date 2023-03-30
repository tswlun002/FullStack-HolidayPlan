package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.exception.DuplicateException;
import com.Tour.exception.NotFoundException;
import com.Tour.model.Role;
import com.Tour.model.User;
import com.Tour.model.UserRole;
import com.Tour.model.UserType;
import com.Tour.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Set;

@Service
public class UserService implements OnUser {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ApplicationEventPublisher publisher;
   @Autowired private  OnRole onRole;



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
        if(getUser(user.getUsername())!=null) throw  new DuplicateException("User already exists");
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
    public List<User> getUsers(int age) {
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
    private  void updateUser(User user) {
        try{
            userRepository.save(user);
        }  catch (Exception e){
            CatchException.catchException(e);
        }
    }

   /* private  void catchException(Exception e){
       CatchException.catchException(e);
    }*/

}
