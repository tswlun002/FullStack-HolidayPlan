package com.Tour.security;

import com.Tour.model.Token;
import com.Tour.model.User;
import com.Tour.service.JwtService;
import com.Tour.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static com.Tour.security.TokenType.ACCESS_TOKEN;
import static com.Tour.security.TokenType.REFRESH_TOKEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Builder

@AllArgsConstructor
public class CustomerAuthenticationFilter  extends UsernamePasswordAuthenticationFilter {
    private  final AuthenticationManager authenticationManager;

    private final JwtService jwtService;
    private final TokenService tokenService;

    private final CustomerUserDetailsService userDetailsService;



    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
       String username = request.getParameter("username");
       String password  = request.getParameter("password");

        UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(username,password);
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {

        var username=  authResult.getPrincipal().toString();
        var user = userDetailsService.loadUserByUsername(username).user();
        var access_token  = jwtService.generateAccessToken(user);
        var refresh_token = jwtService.generateRefreshToken(user);
        tokenService.revokeAllUserToken(user,REFRESH_TOKEN);
        tokenService.revokeAllUserToken(user, ACCESS_TOKEN);
        saveUserToken(user,access_token, ACCESS_TOKEN);
        saveUserToken(user, refresh_token,REFRESH_TOKEN);
        Map<String,String> tokens = new HashMap<>();
        tokens.put("access_token",access_token);

        Cookie cookie = new Cookie("token", refresh_token);
        cookie.setMaxAge(24 * 60 * 60); // expires in 7 days
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/"); // global cookie accessible everywhere
        //add cookie to response
        response.addCookie(cookie);
       response.setContentType(APPLICATION_JSON_VALUE);
       new ObjectMapper().writeValue(response.getOutputStream(),tokens);

    }


    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        Map<String,String> tokens = new HashMap<>();
        tokens.put("error_message", failed.getMessage());
        response.setStatus(HttpStatus.NOT_FOUND.value());
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(),tokens);
    }

    private void saveUserToken(User user, String jwt, TokenType tokenType) {
        var token = Token.builder().user(user).token(jwt).tokenType(tokenType).expired(false).revoked(false).build();
        tokenService.save(token);
    }





}
