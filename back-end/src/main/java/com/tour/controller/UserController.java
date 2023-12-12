package com.tour.controller;

import com.tour.dto.*;
import com.tour.exception.NotFoundException;
import com.tour.model.User;
import com.tour.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/holiday-plan/api/user/")
@AllArgsConstructor
public class UserController {

     private final UserService userService;

     @GetMapping(value = "logout/",consumes = "application/json")
     public  ResponseEntity<Boolean> logout(HttpServletRequest request, HttpServletResponse response){
         return  new ResponseEntity<>(true, OK);
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
        return  new ResponseEntity<>(users, OK);
    }

    @PatchMapping(value = "update/none-security")
    public ResponseEntity<String> updateUserNoneSecurityData(@RequestBody EditUserNoneSecurityData editUserNoneSecurityData) {
        return userService.updateUserDetails(editUserNoneSecurityData)?
                new ResponseEntity<>("Update details successfully.", HttpStatus.OK)
        :
                new ResponseEntity<>("Failed to update details.", HttpStatus.NOT_ACCEPTABLE);
    }
    @PostMapping("update/password-change-request")
    public ResponseEntity<?> updateUserSecurityRequest(@RequestBody SecurityEditRequest edit) {
         userService.resetPassword(edit.username());
         return  new ResponseEntity<>("OTP code for verification is sent to your email.",OK);
    }
    @PostMapping("update/username-change-request")
    public ResponseEntity<?> updateUserSecurityRequest(@RequestParam("currentUsername") String currentUsername,
                                                       @RequestBody UserAnswerDTO userAnswers) {
        HashMap<Integer, String> answers = new HashMap<>();
        AtomicReference<String> username =  new AtomicReference<>(null);
        userAnswers.answers().forEach(dto ->{
            username.set(dto.username());
            answers.put(dto.number(), dto.answer());
        });
        userService.resetUsername(currentUsername,username.get(),answers);
        return  new ResponseEntity<>("OTP code for verification is sent to your new email.",OK);
    }
    @PostMapping("add-security-questions")
    public ResponseEntity<?> AddSecurityQuestions(@RequestBody @Valid UserAnswerDTO answers)
            throws NotFoundException {
        return answers.answers().stream().allMatch(userService::saveSecurityQuestions)?
                new ResponseEntity<>("Security questions were added successfully", HttpStatus.OK):
                new ResponseEntity<>("Failed to add Security questions", NOT_ACCEPTABLE);
    }
    @PatchMapping(value = "update/security")
    public ResponseEntity<String> updateUserSecurityData(@RequestBody EditUserSecurityData edit) {


        return userService.updateUserSecurityData(edit)?
                new ResponseEntity<>("Changes were successful",OK):
                new ResponseEntity<>("Failed to update",NOT_ACCEPTABLE);

    }

    @GetMapping(path = "{username}")
    public ResponseEntity<UserProfile> get(@PathVariable("username") String username) throws NotFoundException {
        User user =  userService.getUser(username);
        if(user ==null)throw  new NotFoundException("User is not found");
        var profile = new UserProfile(user.getFirstname(), user.getLastname(), user.getAge(),
                user.getUsername(), userService.checkSecurityEnabled(user.getUsername()));
        return  new ResponseEntity<>(profile, HttpStatus.FOUND);
    }
  
    @DeleteMapping("delete/" )
    public  ResponseEntity<Boolean> delete(@RequestParam String username,@RequestParam String password){
        boolean deleted= userService.confirmPassword(password)&& userService.deleteUser(username);
        return deleted? new ResponseEntity<>(true, OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
}
