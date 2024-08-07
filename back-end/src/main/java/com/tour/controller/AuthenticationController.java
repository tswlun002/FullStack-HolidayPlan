package com.tour.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.dto.PasswordResetRequest;
import com.tour.dto.RegisterUserRequest;
import com.tour.dto.SecurityEditRequest;
import com.tour.exception.NotFoundException;
import com.tour.model.VerificationToken;
import com.tour.security.AuthenticationResponse;
import com.tour.service.AuthenticationService;
import com.tour.service.UserService;
import com.tour.service.VerificationTokenService;
import com.tour.utils.MapResponse;
import com.tour.utils.VerificationURL;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
@RestController
@RequestMapping("/holiday-plan/api/authenticate/")
@AllArgsConstructor
@Validated
public class AuthenticationController {

   private final AuthenticationService authenticationService;
   private  final UserService userService;
   private  final VerificationTokenService verificationTokenService;

    @GetMapping(value = "accessToken/refresh/")
    public void refreshToken(HttpServletRequest request,
                                             HttpServletResponse response ) throws IOException {

      var token= authenticationService.refreshToken(request);
      AuthenticationResponse tokens= new AuthenticationResponse(new HashMap<>());
      if(token!=null) {
          response.setStatus(OK.value());
          tokens.tokens().put("access_token",token);

      }else{
        response.setStatus(HttpStatus.NOT_ACCEPTABLE.value());
          tokens.tokens().put("error_message","Invalid User credential");

      }
      response.setContentType(APPLICATION_JSON_VALUE);
      new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }
    @PostMapping(value="register",consumes = {"application/json"})
    public ResponseEntity<Boolean> save(@RequestBody  @Valid RegisterUserRequest requester,
                                        HttpServletRequest request){
        var url =new VerificationURL(request.getServerName(),request.getServerPort(),request.getContextPath());
        var saved= userService.saveUser(requester,url) ;

        return saved?
                new ResponseEntity<>(true, OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
    @GetMapping(value = "verify-mail")
    public  ResponseEntity<String> verify(@RequestParam("token") String token,HttpServletRequest request){

         VerificationToken token1 = verificationTokenService.findByToken(token)
                 .orElseThrow(()->new NotFoundException("VerificationToken is not found"));

        var url =new VerificationURL(request.getServerName(),request.getServerPort(),request.getContextPath());
        var isVerified= verificationTokenService.verifyToken(token1, url);
        if(isVerified) {
           isVerified= userService.verifyUser(token1.getUser());
        }
        var header = new HttpHeaders();
        header.setLocation(URI.create("http://localhost:3000/"));

        return  isVerified?
                new ResponseEntity<>(header,HttpStatus.MOVED_PERMANENTLY)
                :new ResponseEntity<>("Failed to verify account.",
                HttpStatus.NOT_ACCEPTABLE);


    }

    @PutMapping(value = "password-reset-request")
    public   void requestResetPassword(@RequestBody @Valid SecurityEditRequest edit, HttpServletResponse response) throws IOException {
        userService.resetPassword(edit.username(), edit.password());
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(OK.value());
        new ObjectMapper().writeValue(response.getOutputStream(),
                new MapResponse("message","OTP code for password reset is sent to your email."));

    }

    @PostMapping(value = "reset-password")
    public  ResponseEntity<String>  resetPassword(@RequestBody @Valid PasswordResetRequest  passwordResetRequest){
        return userService.resetPassword(passwordResetRequest)?
                new ResponseEntity<>("Password was successful updated",OK):
                new ResponseEntity<>("Failed to update password",NOT_ACCEPTABLE);
    }

}
