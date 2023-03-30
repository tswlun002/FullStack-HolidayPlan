package com.Tour.security;

import com.Tour.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
public class CustomerUserDetails implements UserDetails {

    private  final User user;

    public User getUser() {
        return user;
    }

    public CustomerUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> permissions = new ArrayList<>();
        user.getRoles().forEach(role -> permissions.add( new SimpleGrantedAuthority("ROLE_"+role.getName().name())));
        user.getRoles().forEach(role -> role.getPermissions().forEach(permission ->
                    permissions.add(new SimpleGrantedAuthority(permission.getName().name()) ))
        );
        permissions.forEach(System.out::println);
        return permissions;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
