package com.tour.service;

import com.tour.dto.PasswordResetEvent;
import com.tour.exception.CatchException;
import com.tour.exception.InvalidToken;
import com.tour.model.PasswordResetToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@RequiredArgsConstructor
@Service
public class PasswordResetEventListener  extends Email {
    private  final OnPasswordReset onPasswordReset;
    private  final JavaMailSender mailSender;
    @Value("${password.reset.expire.time:15}")
    private int EXPIRATION;
    @Value("${host.password.reset.mail}")
    private String EMAIL_DETAILS;
    @EventListener
    void createPasswordResetToken(PasswordResetEvent event) {

        var passwordResetToken= onPasswordReset.createToken(event.user());
        if(passwordResetToken!=null){
            sendMail( event.url()+"authenticate/reset-password?token=",passwordResetToken);
        }
        else throw new InvalidToken("Failed to create password reset verification ");

    }

    private void sendMail(String url, PasswordResetToken token)  {

        try{
             super.sendEmail(
                     mailSender, getEmail(EMAIL_DETAILS),
                     token.getUser().getUsername(),
                     url,
                     token.getToken(),
                     EXPIRATION
             );
        }catch (Exception e){
            onPasswordReset.delete(token);
            CatchException.catchException(e);
        }
    }

}
