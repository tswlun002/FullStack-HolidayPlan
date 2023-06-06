package com.Tour.controller;

import com.Tour.dto.RegisterUserRequest;
import com.Tour.model.User;
import com.Tour.security.AuthenticationResponse;
import com.Tour.service.AuthenticationService;
import com.Tour.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
<<<<<<< HEAD
import java.util.HashMap;
import java.util.HashSet;
=======
import java.util.Arrays;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@CrossOrigin( origins = "*")
@RequestMapping("/holiday-plan/api/authenticate/")
@AllArgsConstructor
public class AuthenticationController {


   private final AuthenticationService authenticationService;
   private  final UserService userService;
    @GetMapping(value = "token/refresh/")
    public void refreshToken(HttpServletRequest request,
                                             HttpServletResponse response ) throws IOException {

<<<<<<< HEAD
      var token= authenticationService.refreshToken(request);
      AuthenticationResponse responseMessage= new AuthenticationResponse(new HashMap<>());
      if(token!=null) {
=======
      System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      System.out.println(request.toString());
      var tokens= authenticationService.refreshToken( request.getHeader("Authorization"));
      if(tokens.tokens().size()>1) {
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
          response.setStatus(HttpStatus.OK.value());
          responseMessage.tokens().put("access_token",token);

      }else{
        response.setStatus(HttpStatus.NOT_ACCEPTABLE.value());
        responseMessage.tokens().put("message","Invalid User credential ");

      }
      response.setContentType(APPLICATION_JSON_VALUE);
      new ObjectMapper().writeValue(response.getOutputStream(), responseMessage);
    }
    @PostMapping(value="user/save/",consumes = {"application/json"})
    public ResponseEntity<Boolean> save(@RequestBody  @Validated RegisterUserRequest request){
        var user  = User.builder().firstname(request.firstname()).lastname(request.lastname())
                .age(request.age()).username(request.username()).password(request.password())
                .roles(new HashSet<>()).build();
        var saved= userService.saveUser(user) ;
        return saved?
                new ResponseEntity<>(true, HttpStatus.OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
}
