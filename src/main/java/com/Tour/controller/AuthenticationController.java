package com.Tour.controller;

import com.Tour.security.AuthenticationResponse;
import com.Tour.service.AuthenticationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@CrossOrigin( origins = "*")
@RequestMapping("/holiday-plan/api/authenticate/")
public class AuthenticationController {

   @Autowired
   private AuthenticationService authenticationService;



    @GetMapping(value = "refresh/")
    public void refreshToken(HttpServletRequest request,
                                             HttpServletResponse response ) throws IOException {

      System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
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
}
