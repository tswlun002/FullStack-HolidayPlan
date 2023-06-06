package com.Tour.controller;

import com.Tour.dto.EditUserRequest;
import com.Tour.exception.CatchException;
import com.Tour.exception.InvalidCredentials;
import com.Tour.exception.NotFoundException;
import com.Tour.model.User;
import com.Tour.security.CustomerUserDetailsService;
<<<<<<< HEAD
import com.Tour.dto.UserResponseToUser;
=======
import com.Tour.service.UserBYAdminDTO;
import com.Tour.service.UserDTO;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
import com.Tour.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;
=======
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
import java.util.Set;
import java.util.stream.Collectors;

@RestController
<<<<<<< HEAD
@RequestMapping("/holiday-plan/api/user/")
@AllArgsConstructor
public class UserController {

     private final UserService userService;
     private final CustomerUserDetailsService customerUserDetailsService;
=======
@RequestMapping("/holiday-plan/api/")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired private CustomerUserDetailsService customerUserDetailsService;


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

>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7

     @GetMapping(value = "logout/",consumes = "application/json")
     public  ResponseEntity<Boolean> logout(HttpServletRequest request, HttpServletResponse response){
         return  new ResponseEntity<>(true, HttpStatus.OK);
     }
    @GetMapping(path="users/")
    public ResponseEntity<Set<UserResponseToUser>> getAllUsers(){
        var users = userService.getUsers()
                .stream().map(user->
                        UserResponseToUser.builder().age(user.getAge())
                                .username(user.getUsername()).lastname(user.getLastname())
                                .firstname(user.getFirstname()).build())
                .collect(Collectors.toSet());
        if(users.isEmpty())throw new NotFoundException("User(s) is not found");
        return  new ResponseEntity<>(users,HttpStatus.OK);
    }
<<<<<<< HEAD
=======
    @GetMapping(path="admin/user/users/")
    public ResponseEntity<Set<UserBYAdminDTO>> getAllUsersByAdmin(){
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
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7

    @PatchMapping(value = "update/")
    public ResponseEntity<Boolean> updateUserDetails(@RequestBody EditUserRequest editUserRequest) {
        System.out.println(editUserRequest);
        if(! userService.confirmPassword(editUserRequest.currentPassword())){
            throw  new InvalidCredentials("Invalid credentials");
        }

        return userService.updateUserDetails(editUserRequest).map(
                user1 -> new ResponseEntity<>(true, HttpStatus.OK)
        ).orElseGet(()-> new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE));
    }

    @GetMapping(path = "{username}")
    public ResponseEntity<User> get(@PathVariable("username") String username) throws NotFoundException {
        User user =  userService.getUser(username);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);
    }
    @PatchMapping(value = "add/role/")
    public ResponseEntity<Boolean> addRoleToUser( @RequestParam  String username, @RequestParam String roleName){
        return  userService.addNewRoleToUser(username,roleName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }

<<<<<<< HEAD
    @DeleteMapping(value = "delete/role/")
    public ResponseEntity<Boolean>   deleteRoleFromUser(@RequestParam String username, @RequestParam String roleName){
        return  userService.deleteRoleFromUser(username,roleName)?
=======
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
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @PatchMapping(value = "add/permission/")
    public ResponseEntity<Boolean> addPermissionToUser( @RequestParam  String username, @RequestParam String permissionName){
        return  userService.addPermissionToUser(username,permissionName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }

    @DeleteMapping(value = "delete/permission/")
    public ResponseEntity<Boolean>   deletePermissionFromUser(@RequestParam String username, @RequestParam String permissionName){
        return  userService.deletePermissionFromUser(username,permissionName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @DeleteMapping("delete/{username}" )
    public  ResponseEntity<Boolean> delete(@PathVariable("username") String username){
        boolean deleted=false;
        try {
            deleted= userService.deleteUser(username);
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if (deleted) return new ResponseEntity<>(true, HttpStatus.OK);
        return new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
}
