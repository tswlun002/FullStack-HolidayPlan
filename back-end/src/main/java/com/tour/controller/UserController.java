package com.tour.controller;

import com.tour.dto.EditUserRequest;
import com.tour.exception.CatchException;
import com.tour.exception.InvalidCredentials;
import com.tour.exception.NotFoundException;
import com.tour.model.User;
import com.tour.security.CustomerUserDetailsService;
import com.tour.dto.UserResponseToUser;
import com.tour.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/holiday-plan/api/user/")
@AllArgsConstructor
public class UserController {

     private final UserService userService;
     private final CustomerUserDetailsService customerUserDetailsService;

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

    @DeleteMapping(value = "delete/role/")
    public ResponseEntity<Boolean>   deleteRoleFromUser(@RequestParam String username, @RequestParam String roleName){
        return  userService.deleteRoleFromUser(username,roleName)?
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