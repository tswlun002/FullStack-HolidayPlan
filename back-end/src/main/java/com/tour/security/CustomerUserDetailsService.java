package com.tour.security;

import com.tour.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomerUserDetailsService  implements UserDetailsService {

    @Autowired
    private UserService userService;


    @Override
    public CustomerUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userService.getUser(username);
        if(user ==null) throw  new UsernameNotFoundException("User is not found");
        else {
            return new CustomerUserDetails(user);
        }
    }
}
