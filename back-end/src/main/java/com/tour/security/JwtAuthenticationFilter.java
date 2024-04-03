package com.tour.security;

import com.tour.exception.InvalidCredentials;
import com.tour.service.JwtService;
import com.tour.service.AccessTokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.thymeleaf.util.StringUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private  CustomerUserDetailsService userDetailsService;
    @Autowired
    private AccessTokenService accessTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        var path =  request.getServletPath();
        var value =path.equalsIgnoreCase("/")||StringUtils.startsWith(path,"/holiday-plan/api/authenticate/");
        log.info("------------------ {}, {}",path,value);
        if(
                path.equalsIgnoreCase("/")||StringUtils.startsWith(path,"/holiday-plan/api/authenticate/")

        ){
            filterChain.doFilter(request,response);
            return;
        }
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith(AccessTokenAlgorithm.Bearer.getName()+" ")){
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(AccessTokenAlgorithm.Bearer.name().length()).trim();
            final String username  = jwtService.extractUsername(jwt);
            //if user is present and is not authenticated
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                CustomerUserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
               this.accessTokenService.findByToken(jwt).ifPresent(token1 ->{
                           if(!token1.isExpired() && !token1.isRevoked()&& jwtService.isTokenValid(token1.getToken(),userDetails.user())){
                               //if the accessToken on the header and database is still valid, update security holder context
                               log.info("-------------------------- Token is still valid ------------------------------");
                               var authenticationToken =
                                       new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
                               authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                               SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                           }
                           else {
                               throw new InvalidCredentials("Invalid access token");
                           }
                });
            }

        }
        catch (Exception e)
        {
            log.info("----------------------- error: {}",e.getMessage());
            Map<String,String> tokens = new HashMap<>();
            tokens.put("error_message", e.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(),tokens);
            return;
        }
        filterChain.doFilter(request,response);
    }
}
