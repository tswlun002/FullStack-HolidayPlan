package com.Tour.controller;

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

      System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      System.out.println(request.toString());
      var tokens= authenticationService.refreshToken( request.getHeader("Authorization"));
      if(tokens.tokens().size()>1) {
          response.setStatus(HttpStatus.OK.value());

      }else{
        response.setStatus(HttpStatus.FORBIDDEN.value());
      }
      response.setContentType(APPLICATION_JSON_VALUE);
      new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }
}
