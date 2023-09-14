package com.tour.security;

import com.tour.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public record CustomerUserDetails(User user) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> permissions = new ArrayList<>();
        user.getRoles().forEach(role -> permissions.add(new SimpleGrantedAuthority("ROLE_" + role.getName())));
        user.getRoles().forEach(role -> role.getPermissions().forEach(permission ->
        {
            var perm  = new SimpleGrantedAuthority(permission.getName());
            if(!permissions.contains(perm))permissions.add(new SimpleGrantedAuthority(permission.getName()));
        })
        );
        user.getPermissions().forEach(permission ->{
            var perm  = new SimpleGrantedAuthority(permission.getName());
            if(!permissions.contains(perm))permissions.add(perm);
        });

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
        return user.isEnabled();
    }
}
