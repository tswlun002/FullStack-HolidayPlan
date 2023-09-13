package com.tour.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.dto.PasswordResetRequest;
import com.tour.dto.RegisterUserRequest;
import com.tour.exception.NotFoundException;
import com.tour.model.VerificationToken;
import com.tour.security.AuthenticationResponse;
import com.tour.service.AuthenticationService;
import com.tour.service.PasswordResetService;
import com.tour.service.UserService;
import com.tour.service.VerificationTokenService;
import com.tour.utils.MapResponse;
import com.tour.utils.VerificationURL;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import java.io.IOException;
import java.util.HashMap;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
@RestController
@RequestMapping("/holiday-plan/api/authenticate/")
@AllArgsConstructor
public class AuthenticationController {

   private final AuthenticationService authenticationService;
   private  final UserService userService;
   private  final VerificationTokenService verificationTokenService;
   private  final PasswordResetService passwordResetService;
    @GetMapping(value = "accessToken/refresh/")
    public void refreshToken(HttpServletRequest request,
                                             HttpServletResponse response ) throws IOException {

      var token= authenticationService.refreshToken(request);
      AuthenticationResponse responseMessage= new AuthenticationResponse(new HashMap<>());
      if(token!=null) {
          response.setStatus(OK.value());
          responseMessage.tokens().put("access_token",token);

      }else{
        response.setStatus(HttpStatus.NOT_ACCEPTABLE.value());
        responseMessage.tokens().put("message","Invalid User credential ");

      }
      response.setContentType(APPLICATION_JSON_VALUE);
      new ObjectMapper().writeValue(response.getOutputStream(), responseMessage);
    }
    @PostMapping(value="register",consumes = {"application/json"})
    public ResponseEntity<Boolean> save(@RequestBody  @Validated RegisterUserRequest requester,
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

        return  isVerified?
                new ResponseEntity<>("Account is verified, you can login", OK)
                :new ResponseEntity<>("Failed to verify account.",
                HttpStatus.NOT_ACCEPTABLE);


    }
    @GetMapping(value = "password-reset-request")
    public   void requestResetPassword(@RequestParam("email") String email,
                                                              HttpServletRequest request,
                                                              HttpServletResponse response) throws IOException {
        userService.resetPassword(email,
                new VerificationURL(request.getServerName(), request.getServerPort(), request.getContextPath()));
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(OK.value());
        new ObjectMapper().writeValue(response.getOutputStream(),
                new MapResponse("message","Link is sent to email, check emails"));

    }
    @GetMapping(value = "reset-password", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public   ModelAndView resetPassword(@RequestParam("token") String token,
                                  Model model){
        model.addAttribute("token",token);
        model.addAttribute("passwordResetRequest", PasswordResetRequest.builder().token(token).build());
        var map = new HashMap<String, Model>();
        map.put("reset-password",model);
        return new ModelAndView("reset-password",map);

    }
    @PostMapping(value = "reset-password")
    public  ResponseEntity<String> resetPassword(@Valid PasswordResetRequest  passwordResetRequest,
                                                 BindingResult bindingResult, Model model,
                                                 HttpServletRequest request){

        boolean resetPasswordToken = passwordResetService.verify(passwordResetRequest,
                new VerificationURL(request.getServerName(), request.getServerPort(), request.getContextPath()) );
        return resetPasswordToken&& userService.resetPassword(passwordResetRequest)?
                new ResponseEntity<>("Password was changed successfully.", OK):
                new ResponseEntity<>("Failed to reset password", NOT_ACCEPTABLE);

    }

}
