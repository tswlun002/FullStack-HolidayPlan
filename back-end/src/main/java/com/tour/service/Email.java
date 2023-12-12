package com.tour.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.dto.EmailDTO;
import com.tour.exception.CatchException;
import com.tour.exception.NullException;
import jakarta.annotation.Nonnull;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public abstract class Email {

    @Nonnull
    protected String  styleMail(String mailContent, String token, int expiration) {

        return "<html>\n" +
                "  <head>\n" +
                "    <style>\n" +
                "      .button {\n" +
                "        display: inline-block;\n" +
                "        padding: 10px 20px;\n" +
                "        text-align: center;\n" +
                "        text-decoration: none;\n" +
                "        color: #ffffff !important;\n" +
                "        background-color:rgb(143, 88, 175);\n" +
                "        border-radius: 6px;\n" +
                "        outline: none;\n" +
                "        transition: 0.3s;\n" +

                "      }\n" +
                "      .button:hover, .button:focus {\n" +
                "        background-color: #4169e1;\n" +
                "        color: #ffffff;\n" +
                "      }\n" +

                "    </style>\n" +
                "  </head>\n" +
                "  <body>\n" +
                mailContent + "\n" +token+"\n"+

                "     <p>Verification expires after: "+ expiration +" minutes </p>"+

                "  </body>\n" +
                "</html>";


    }
    protected EmailDTO getEmail(String emailDetails) throws IOException {


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
   protected void sendEmail(JavaMailSender mailSender,EmailDTO email,
                   String recipient,
                   String token,
                   int expiration) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper =  new MimeMessageHelper(message,true);
        helper.setFrom(email.senderName());
        helper.setTo(recipient);
        helper.setSubject(email.subject());
        helper.setText(styleMail(email.content(),token,expiration),true);
        mailSender.send(message);
    }
}
