package com.tour.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.dto.EmailDTO;
import com.tour.dto.RegisterEvent;
import com.tour.exception.CatchException;
import com.tour.exception.NullException;
import com.tour.model.User;
import com.tour.model.VerificationToken;
import jakarta.annotation.Nonnull;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
@Slf4j

@RequiredArgsConstructor
@Service
public class RegisterEventListener {
    private  final  OnVerificationToken onVerificationToken;
    private  final Environment environment;
    private  final  JavaMailSender  mailSender;
    private  final  OnUser onUser;
    private User user;
    @Value("${verification.expire.time:15}")
    private int EXPIRATION;

    /**
     * Generate Verification token and send verification by email to  user email
     * @param event is the RegisterEvent
     * @throws  NullException if the user is null
     * @throws  RuntimeException if the failed to create verification token and send email
     */
    @EventListener
    void sendVerification(RegisterEvent event) {

         user =event.user();
        if(user==null) throw new NullException("User is invalid");

        var token = UUID.randomUUID().toString();
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, EXPIRATION);
        var verificationToken =VerificationToken.builder().
                token(token).
                user(user).
                expirationDate(new Date(calendar.getTime().getTime())).
                isVerified(false).build();
        var isSaved= onVerificationToken.saveToken(verificationToken);

       if(isSaved) {
           sendMail( event.url(),verificationToken);
           log.info("Email sent successfully to: {}",user.getUsername());
       }
       else throw new RuntimeException("Failed to create verification Token");

    }



    @Nonnull
    private  String styleMail(String mailContent, String url, String token) {

        return "<html>\n" +
                "  <head>\n" +
                "    <style>\n" +
                "      .button {\n" +
                "        display: inline-block;\n" +
                "        padding: 10px 20px;\n" +
                "        text-align: center;\n" +
                "        text-decoration: none;\n" +
                "        color: #ffffff;\n" +
                "        background-color:rgb(143, 88, 175);\n" +
                "        border-radius: 6px;\n" +
                "        outline: none;\n" +
                "        transition: 0.3s;\n" +

                "      }\n" +
                "      .button:hover, .button:focus {\n" +
                "        background-color: #4169e1;\n" +
                "      }\n" +

                "    </style>\n" +
                "  </head>\n" +
                "  <body>\n" +
                     mailContent +
                "    <a class=\"button\" href=\""+url+token+"\">Verify email</a>\n" +
                "     <p>Verification expires after: "+ EXPIRATION +" minutes </p>"+

                "  </body>\n" +
                "</html>";


    }

    /**
     * Send email  for account verification
     * @param url is the verification end-point
     * @param token is the verification token
     */
    public void sendMail(String url,VerificationToken token)  {
        try {
            var email = getEmail();
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =  new MimeMessageHelper(message,true);
            helper.setFrom(email.senderName());
            helper.setTo(user.getUsername());
            helper.setSubject(email.subject());
            helper.setText(styleMail(email.content(),url,token.getToken()),true);
            mailSender.send(message);
        }catch (Exception e){

            var username =token.getUser().getUsername();
            var deleted =onVerificationToken.deleteToken(token.getToken());
            if(deleted)onUser.deleteUser(username);
            CatchException.catchException(e);
        }
    }

    private EmailDTO getEmail() throws IOException {
        var emailDetails = environment.getProperty("host.registration.mail");

        if(emailDetails==null || emailDetails.trim().length()<=1
        ||emailDetails.split(",").length<4)throw  new IOException("Invalid  email details");
        EmailDTO email = null;
        try{
            email= new ObjectMapper().readValue(emailDetails,EmailDTO.class);
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if(email==null) throw new NullException("Invalid  email mapping");
        return email;
    }

}
