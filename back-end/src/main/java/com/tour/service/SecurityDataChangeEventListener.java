package com.tour.service;

import com.tour.dto.SecurityChangeDataEvent;
import com.tour.exception.CatchException;
import com.tour.exception.InvalidToken;
import com.tour.model.SecurityDataChangeToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@RequiredArgsConstructor
@Service
public class SecurityDataChangeEventListener extends Email {
    private  final ISecurityDataChange ISecurityDataChange;
    private  final JavaMailSender mailSender;
    @Value("${password.reset.expire.time:15}")
    private int EXPIRATION;
    @Value("${host.password.reset.mail}")
    private String EMAIL_DETAILS;
    @EventListener
    void createToken(SecurityChangeDataEvent event) {

        var passwordResetToken= ISecurityDataChange.createToken(event.user());
        if(passwordResetToken!=null){
            sendMail( passwordResetToken,event.email());
        }
        else throw new InvalidToken("Failed to create password reset verification ");

    }

    private void sendMail( SecurityDataChangeToken token,String email)  {

        try{
             super.sendEmail(
                     mailSender, getEmail(EMAIL_DETAILS),
                     email,
                     "<p>OTP: "+token.getOTP()+"</p>",

                     EXPIRATION
             );
        }catch (Exception e){
            ISecurityDataChange.delete(token);
            CatchException.catchException(e);
        }
    }

}
