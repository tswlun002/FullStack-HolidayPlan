package com.Tour.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomerAuthenticationProvider implements AuthenticationProvider {
    @Autowired
    private  CustomerUserDetailsService userDetailsService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String username  = authentication.getName();
        String password = authentication.getCredentials().toString();
        CustomerUserDetails user = userDetailsService.loadUserByUsername(username);

        return checkPassword(user,password);
    }

    private Authentication checkPassword(CustomerUserDetails user, String password) {
        if(bCryptPasswordEncoder.matches(password, user.getPassword())){
            return  new UsernamePasswordAuthenticationToken(user.getUsername(),
                    user.getPassword(),user.getAuthorities());
        }
        else{
            throw  new BadCredentialsException("Bad credentials");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return  UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
