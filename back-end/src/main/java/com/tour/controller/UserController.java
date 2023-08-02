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
  
    @DeleteMapping("delete/" )
    public  ResponseEntity<Boolean> delete(@RequestParam String username,@RequestParam String password){
        boolean deleted= userService.confirmPassword(password)&& userService.deleteUser(username);
        return deleted? new ResponseEntity<>(true, HttpStatus.OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
}
