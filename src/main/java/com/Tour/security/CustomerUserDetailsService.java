package com.Tour.security;

import com.Tour.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomerUserDetailsService  implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Override
    public CustomerUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.getTourist(username);
        if(user ==null) throw  new UsernameNotFoundException("User is not found");
        else {
            return new CustomerUserDetails(user);
        }
    }
}
