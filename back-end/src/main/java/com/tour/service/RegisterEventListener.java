package com.tour.service;

import com.tour.dto.RegisterEvent;
import com.tour.exception.CatchException;
import com.tour.exception.InvalidToken;
import com.tour.model.User;
import com.tour.model.VerificationToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Slf4j

@RequiredArgsConstructor
@Service
public class RegisterEventListener extends Email {
    private  final IVerificationToken iVerificationToken;
    private  final  JavaMailSender  mailSender;
    private  final IUser iUser;

    private User user;
    @Value("${verification.expire.time:15}")
    private int EXPIRATION;
    @Value("${host.registration.mail}")
    private String EMAIL_DETAILS;

    /**
     * Generate Verification token and send verification by email to  user email
     * @param event is the RegisterEvent
     * @throws  InvalidToken if the user is null and  if the failed to create verification token and send email
     */
    @EventListener(value = RegisterEvent.class)
    void sendVerification(RegisterEvent event) {

         user =event.user();
        if(user==null) throw new InvalidToken("User is invalid");


        var verificationToken= iVerificationToken.saveToken(user);

       if(verificationToken !=null) {
           sendMail( event.url()+"authenticate/verify-mail?token=",verificationToken);
           log.info("Email sent successfully to: {}",user.getUsername());
       }
       else throw new InvalidToken("Failed to create verification Token");

    }

    /**
     * Send email  for account verification
     * @param url is the verification end-point
     * @param token is the verification token
     */
    private void sendMail(String url,VerificationToken token)  {
        try {
            super.sendEmail(
                    mailSender,
                    getEmail(StringEscapeUtils.unescapeJson(EMAIL_DETAILS)),
                    token.getUser().getUsername(),
                    "    <a class=\"button\" href=\""+url+token.getToken()+"\">Verify email</a>"
                    ,
                    EXPIRATION
            );

        }catch (Exception e){
            var username =token.getUser().getUsername();
            iUser.deleteUser(username);
            CatchException.catchException(e);
        }
    }



}
