package com.tour.controller;

import com.tour.dto.RegisterUserRequest;
import com.tour.model.User;
import com.tour.security.AuthenticationResponse;
import com.tour.service.AuthenticationService;
import com.tour.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("/holiday-plan/api/authenticate/")
@AllArgsConstructor
public class AuthenticationController {


   private final AuthenticationService authenticationService;
   private  final UserService userService;
    @GetMapping(value = "token/refresh/")
    public void refreshToken(HttpServletRequest request,
                                             HttpServletResponse response ) throws IOException {

      var token= authenticationService.refreshToken(request);
      AuthenticationResponse responseMessage= new AuthenticationResponse(new HashMap<>());
      if(token!=null) {
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
