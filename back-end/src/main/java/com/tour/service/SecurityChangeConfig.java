package com.tour.service;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityChangeConfig {
    @Bean
    public  PasswordResetBean getPasswordResetBean(){
        return PasswordResetBean.builder().build();
    }
}
