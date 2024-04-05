package com.tour.controller;

import cn.minsin.core.tools.StringUtil;
import com.tour.dto.*;
import com.tour.exception.NotFoundException;
import com.tour.model.SecurityQuestionAnswer;
import com.tour.model.User;
import com.tour.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.Date;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/holiday-plan/api/user/")
@AllArgsConstructor
@Validated
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
    public ResponseEntity<String> updateUserNoneSecurityData(
            @RequestParam(required = false)
            String  firstname,
            @RequestParam(required = false)
            String lastname,
            @RequestParam(required = false)

            String age,
            @RequestParam(required = false)
            String currentUsername
    ) {
         Function<String , String> isBeingEdited= (input)->StringUtil.isNotBlank(input)?input:null;
         firstname =isBeingEdited.apply(firstname);
         lastname=isBeingEdited.apply(lastname);
        currentUsername= isBeingEdited.apply(currentUsername);
        Date date=null;
         if(  isBeingEdited.apply(age)!=null) {
             DateTimeFormatter inputDateTimeFormatter =
                     new DateTimeFormatterBuilder().appendPattern("yyyy-MM-dd")
                             .parseDefaulting(ChronoField.NANO_OF_DAY, 0)
                             .toFormatter()
                             .withZone(ZoneOffset.UTC);
             ZonedDateTime zonedDateTime = ZonedDateTime.parse(age, inputDateTimeFormatter);
             date =new Date(zonedDateTime.toEpochSecond()*1000);
         }
         return userService.updateUserDetails(new EditUserNoneSecurityData(firstname,lastname, date , currentUsername))?
                new ResponseEntity<>("Update details successfully.", HttpStatus.OK)
        :
                new ResponseEntity<>("Failed to update details.", HttpStatus.NOT_ACCEPTABLE);
    }
    @PutMapping("update/password-change-request")
    public ResponseEntity<?> updateUserSecurityRequest(@RequestBody @Valid SecurityEditRequest edit) {
         userService.resetPassword(edit.username(), edit.password());
         return  new ResponseEntity<>("OTP code for verification is sent to your email.",OK);
    }
    @GetMapping("update/username-change-request")
    public ResponseEntity<?> updateUserSecurityRequest(@RequestParam("username") @Email(message = "username must be valid email address")
                                                           String username,
                                                       @RequestParam("newUsername")@Email(message = "username must be valid email address")
                                                       String newUsername) {

        var securityQuestions=userService.resetUsername(username, newUsername);
        if(securityQuestions.isEmpty()){
            return  new ResponseEntity<>("OTP is sent to your new email",OK);
        }
        var questions=securityQuestions.stream().map((SecurityQuestionAnswer::getQuestion)).collect(Collectors.toSet());
        return  new ResponseEntity<>(new UserSecurityQuestions(newUsername,questions,"Answer questions and provide OTP sent to new email"),OK);
    }
    @PostMapping("add-security-questions")
    public ResponseEntity<?> AddSecurityQuestions(@RequestBody @Valid UserAnswerDTO answers)
            throws NotFoundException {
        return answers.answers().stream().allMatch(userService::saveSecurityQuestions)?
                new ResponseEntity<>("Security questions were added successfully", HttpStatus.OK):
                new ResponseEntity<>("Failed to add Security questions", NOT_ACCEPTABLE);
    }
    @PatchMapping(value = "security/change-password")
    public ResponseEntity<String> updateUserSecurityData(@RequestBody @Valid ResetPassword edit) {
        return userService.changePassword(edit)?
                new ResponseEntity<>("Changes were successful",OK):
                new ResponseEntity<>("Failed to update",NOT_ACCEPTABLE);

    }
    @PatchMapping(value = "security/change-username")
    public ResponseEntity<String> updateUserSecurityData(@RequestBody @Valid  ResetUsername edit) {
        return userService.changeUsername(edit)?
                new ResponseEntity<>("Changes were successful",OK):
                new ResponseEntity<>("Failed to update",NOT_ACCEPTABLE);

    }

    @GetMapping(path = "{username}")
    public ResponseEntity<UserProfile> get(@PathVariable("username") @Email(message = "username must be valid email address")
                                               String username) throws NotFoundException {
        User user =  userService.getUser(username);
        if(user ==null)throw  new NotFoundException("User is not found");
        var profile = new UserProfile(user.getFirstname(), user.getLastname(), user.getAge(),
                user.getUsername(), userService.checkSecurityEnabled(user.getUsername()));
        return  new ResponseEntity<>(profile, HttpStatus.FOUND);
    }
    @PostMapping("request-to-delete/{username}" )
    public  ResponseEntity<?> reuqestToDelete(@PathVariable("username") @Email(message = "username must be valid email address")
                                                  String username){
        var securityQuestions=userService.reuqestToDeleteUserAccount(username);
        if(securityQuestions.isEmpty()){
            return  new ResponseEntity<>("OTP is sent to your new email",OK);
        }
        var questions=securityQuestions.stream().map((SecurityQuestionAnswer::getQuestion)).collect(Collectors.toSet());
        return  new ResponseEntity<>(new UserSecurityQuestions(username,questions,"Answer questions and provide OTP sent to new email"),OK);
    }
  
    @DeleteMapping("delete" )
    public  ResponseEntity<Boolean> delete(@RequestParam String username,@RequestParam String password){
        boolean deleted= userService.confirmPassword(password)&& userService.deleteUser(username);
        return deleted? new ResponseEntity<>(true, OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
}
