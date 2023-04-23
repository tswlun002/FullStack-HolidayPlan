package com.Tour.controller;

import com.Tour.exception.CatchException;
import com.Tour.exception.InvalidCredentials;
import com.Tour.exception.NotFoundException;
import com.Tour.model.User;
import com.Tour.model.UserRole;
import com.Tour.model.UserType;
import com.Tour.security.CustomerUserDetailsService;
import com.Tour.service.UserBYAdminDTO;
import com.Tour.service.UserDTO;
import com.Tour.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/holiday-plan/api/")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired private CustomerUserDetailsService customerUserDetailsService;

     @GetMapping(value = "logout/",consumes = "application/json")
     public  ResponseEntity<Boolean> logout(HttpServletRequest request, HttpServletResponse response){
          System.out.println("Logged out .................................................................");
         return  new ResponseEntity<>(true, HttpStatus.OK);
     }

    @PostMapping(value="authenticate/user/save/",consumes = {"application/json"})
    public ResponseEntity<Boolean> save(@RequestBody  @Validated RegisterUserRequest request){
        boolean saved =false;
        UserType type =getType(request.usertype());

        try {

            var user  = User.builder().firstname(request.firstname()).lastname(request.lastname())
                    .age(request.age()).username(request.username()).password(request.password())
                    .userType(type).roles(new HashSet<>()).build();
             saved= userService.saveUser(user) ;
        }
        catch (Exception e){
           CatchException.catchException(e);
        }
        return saved?
                new ResponseEntity<>(true, HttpStatus.OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }


    @GetMapping(path="users/")
    public ResponseEntity<Set<UserDTO>> getAllUsers(){
        var users = userService.getUsers()
                .stream().map(user->
                        UserDTO.builder().userType(user.getUserType()).age(user.getAge())
                                .username(user.getUsername()).lastname(user.getLastname())
                                .firstname(user.getFirstname()).build())
                .collect(Collectors.toSet());
        if(users.size()==0)throw new NotFoundException("User(s) is not found");
        return  new ResponseEntity<>(users,HttpStatus.OK);
    }
    @GetMapping(path="admin/user/users/")
    public ResponseEntity<Set<UserBYAdminDTO>> getAllUsersByAdmin(){
         System.out.println("Username: "+userService.getLoginedUser());
        var users = userService.getUsers()
                .stream().map(user->
                        UserBYAdminDTO.builder().userType(user.getUserType()).age(user.getAge())
                                .username(user.getUsername()).lastname(user.getLastname())
                                .firstname(user.getFirstname()).roles(user.getRoles()).build())
                .collect(Collectors.toSet());
        if(users.size()==0)throw new NotFoundException("User(s) is not found");
        return  new ResponseEntity<>(users,HttpStatus.OK);
    }
    @GetMapping(path="user/age/")
    public ResponseEntity<List<User>> get(@RequestParam LocalDate age) throws NotFoundException {
        List<User> users =  userService.getUsers(age);
        if(users ==null || users.size()==0) throw new NotFoundException("No Tourists found");

        return new ResponseEntity<>(users,HttpStatus.FOUND);
    }

    @GetMapping(path = "user/my-details/")
    public ResponseEntity<User> getMyDetails()  {

        User user =  userService.getLoginedUser();
        System.out.println("hayibo why igeza "+user);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.OK);

    }
    @GetMapping(path = "user/username/{username}")
    public ResponseEntity<User> get(@PathVariable("username") String username) throws NotFoundException {
        User user =  userService.getUser(username);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
    @PatchMapping(value = "user/add/role/")
    public ResponseEntity<Boolean> addNewRoleToUser(
            @RequestParam String userRole, @RequestParam  String userName){
        var role = getRole(userRole);
        return  userService.addNewRoleToUser(role,userName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }

    @PatchMapping(value = "user/update/user/")
    public ResponseEntity<Boolean> updateUserDetails(@RequestBody  EditUserRequest editUserRequest) {
        System.out.println(editUserRequest);
        if(! userService.confirmPassword(editUserRequest.currentPassword())){
             throw  new InvalidCredentials("Invalid credentials");
        }

        return userService.updateUserDetails(editUserRequest).map(
                user1 -> new ResponseEntity<>(true, HttpStatus.OK)
        ).orElseGet(()-> new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE));
    }
    @DeleteMapping(value = "user/delete/role/")
    public ResponseEntity<Boolean>   deleteRoleFromUser(@RequestParam String userName, @RequestParam String userRole){
        var role = getRole(userRole);
        return  userService.deleteRoleFromUser(userName,role)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @DeleteMapping("user/delete/{userName}" )
    public  ResponseEntity<Boolean> delete(@PathVariable String userName){
        boolean deleted=false;
        try {
            deleted= userService.deleteUser(userName);

        }catch (Exception e){
            CatchException.catchException(e);
        }
        if (deleted) return new ResponseEntity<>(true, HttpStatus.OK);
        return new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }

    private  UserRole getRole(String userRole){
        UserRole role ;
        try{
            role = UserRole.valueOf(userRole.trim().toUpperCase());
        }catch (IllegalArgumentException e){
            throw  new InvalidCredentials("Invalid user role "+e.getMessage().substring(e.getMessage().lastIndexOf(".")+1)
                    .toLowerCase());
        }
        return role;
    }
    private  UserType getType(String userType){
        UserType type ;
        try{
            type = UserType.valueOf(userType.trim().toUpperCase());
        }catch (IllegalArgumentException e){
            throw  new InvalidCredentials("Invalid user role "+e.getMessage().substring(e.getMessage().lastIndexOf(".")+1)
                    .toLowerCase());
        }
        return type;
    }
}
