package com.Tour.security;

import com.Tour.exception.CatchException;
import com.Tour.service.JwtService;
import com.Tour.service.TokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private  CustomerUserDetailsService userDetailsService;
    @Autowired
    private  TokenService tokenService;



    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        if( request.getServletPath().equals("/holiday-plan/api/authenticate/user/login")||
                request.getServletPath().equals("/holiday-plan/api/authenticate/refresh")){
            filterChain.doFilter(request,response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        String username = null;

        if (authHeader == null || !authHeader.startsWith(TokenAlgorithm.Bearer.getName()+" ")){
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(TokenAlgorithm.Bearer.name().length()).trim();
        try {
            username = jwtService.extractUsername(jwt);

            //if user is present and is not authenticated
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                CustomerUserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                var isTokenValid = this.tokenService.findByToken(jwt).map(token1 ->
                        !token1.isExpired() && !token1.isRevoked()).orElse(false);
                System.out.println("**************************************************"+isTokenValid);

                //if the token on the header and database is still valid, update security holder context
                if(jwtService.isTokenValid(jwt,userDetails.getUser()) && isTokenValid){
                    var authenticationToken =
                            new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    System.out.println("**************************************************"+SecurityContextHolder.getContext()
                            .getAuthentication().getPrincipal());

                }

            }
        }catch (Exception e)
        {

            System.out.println("###############################################################");

            System.out.println(e.getMessage());
            Map<String,String> tokens = new HashMap<>();
            tokens.put("error_message", e.getMessage());
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(),tokens);
        }


        filterChain.doFilter(request,response);
    }
}
