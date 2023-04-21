package com.Tour.service;

import com.Tour.exception.InvalidCredentials;
import com.Tour.exception.NotFoundException;
import com.Tour.model.Token;
import com.Tour.model.User;
import com.Tour.security.AuthenticationResponse;
import com.Tour.security.TokenAlgorithm;
import com.Tour.security.TokenType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class AuthenticationService {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private  UserService userService;

    @Autowired
    private TokenService tokenService;

    public AuthenticationResponse refreshToken(String authHeader){
        System.out.println(authHeader);
        if(authHeader==null || !authHeader.startsWith("Bearer ")) throw new InvalidCredentials("Credentials are not valid");
        AuthenticationResponse response= new AuthenticationResponse(new HashMap<>());
        try {
           String refresh_token = authHeader.substring(TokenAlgorithm.Bearer.name().length()).trim();
           String username = jwtService.extractUsername(refresh_token);
           User user = userService.getUser(username);
           if (user == null) throw new NotFoundException("User not found");
           var access_token = jwtService.generateAccessToken(user);
           revokeAllUserToken(user);
           saveUserToken(user,access_token);
           response.tokens().put("access_token",access_token);
           response.tokens().put("refresh_token",refresh_token);


       }catch (Exception e){
           response.tokens().put("error_message",e.getMessage());
       }
        return response;
    }

    private void saveUserToken(User user, String jwt) {
        var token = Token.builder().user(user).token(jwt).tokenType(TokenType.ACCESS_TOKEN).expired(false).revoked(false).build();
        tokenService.save(token);
    }

    private void revokeAllUserToken(User user) {
        var validUserTokens  = tokenService.findByAllValidToken(user, TokenType.ACCESS_TOKEN);
        if(validUserTokens.isEmpty())return;

        validUserTokens.forEach(token -> {token.setRevoked(true);token.setExpired(true); tokenService.save(token);});

    }
}
