package com.tour.security;

import com.tour.exception.InvalidCredentials;
import com.tour.service.AccessTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
    @Autowired
    private AccessTokenService accessTokenService;
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        final String authHeader  = request.getHeader("Authorization");
        final  String jwt  ;
        if(authHeader==null || !authHeader.startsWith("Bearer ")) throw  new InvalidCredentials("Invalid user credentials");
        jwt=authHeader.substring(7);
        var  dbToken = accessTokenService.findByToken(jwt).orElse(null);
        if(dbToken ==null)throw  new InvalidCredentials("Invalid user credentials");

        if(accessTokenService.revokeToken(dbToken)) SecurityContextHolder.clearContext();

    }


}
