package com.tour.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import java.util.Properties;

@Configuration
public class MailConfiguration {
    @Value("${MAIL_HOST}")
    private  String HOST_MAIL;
    @Value("${MAIL_USERNAME}")
    private  String EMAIL;
    @Value("${MAIL_PASSWORD}")
    private  String PASSWORD;
    @Value("${MAIL_PROTOCOL}")
    private  String PROTOCOL;
    @Value("${MAIL_PORT}")
    private  int PORT;

    /***
     * Generate Email bean
     * @return JavaMailSender
     */
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(HOST_MAIL);
        mailSender.setPort(PORT);
        mailSender.setUsername(EMAIL);
        mailSender.setPassword(PASSWORD);
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", PROTOCOL);
        props.put("mail.smtp.auth", "true");
        props.put("spring.mail.properties.mail.smtp.starttls.required",true);
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        props.put("mail.smtp.ssl.trust", "host-url");

        return mailSender;
    }
}
