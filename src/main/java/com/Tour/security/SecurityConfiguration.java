package com.Tour.security;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

public class SecurityConfiguration extends  WebSecurityConfigurerAdapter {



    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.jdbcAuthentication();
    }
    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception{
         httpSecurity.authorizeHttpRequests().antMatchers("/home/User").
                 hasAnyRole(UserRole.ADMIN.name()).
                 antMatchers("/home/holiday-plan").hasAnyRole(UserRole.TOURIST.name(),UserRole.ADMIN.name())
                 .antMatchers("/home").permitAll().and().formLogin();
    }
}
