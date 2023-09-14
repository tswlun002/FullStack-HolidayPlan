package com.tour.service;

import com.tour.dto.PasswordResetEvent;
import com.tour.dto.PasswordResetRequest;
import com.tour.exception.CatchException;
import com.tour.exception.InvalidToken;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.PasswordResetToken;
import com.tour.model.User;
import com.tour.repository.PasswordResetTokenRepository;
import com.tour.utils.VerificationURL;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService implements OnPasswordReset {
    private  final PasswordResetTokenRepository repository;
    private  final ApplicationEventPublisher publisher;
    @Value("${password.reset.expire.time:5}")
    private int EXPIRATION;
    @Override
    public PasswordResetToken createToken(User user) {
        if(user==null)throw  new NotFoundException("User is not found");

        findByUserId(user.getId()).
        ifPresent((token)-> {
            if(token.getVerified()) repository.delete(token);
        });

        var token = UUID.randomUUID().toString();
        Calendar calendar =Calendar.getInstance();;
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, EXPIRATION);
        var passwordReset = PasswordResetToken.builder().token(token).user(user).verified(false)
                .expirationDate(new Date(calendar.getTime().getTime())).build();
        var isSaved = false;
        try{
            passwordReset=repository.save(passwordReset);
            isSaved=true;
        }
        catch (Exception e){
            CatchException.catchException(e);
        }
        return isSaved? passwordReset:null;
    }

    @Override
    public void delete(PasswordResetToken token) {
        if(token==null)throw  new InvalidToken("Password reset is invalid ");
        repository.delete(token);
    }

    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        return repository.findByToken(token) ;
    }

    @Override
    public boolean verify(PasswordResetRequest passwordResetRequest, VerificationURL url) {
        var token = findByToken(passwordResetRequest.getToken()).orElseThrow(
                ()-> new InvalidToken("Password reset  is invalid")
        );
        var userToken = findByUsername(passwordResetRequest.getUsername()).orElseThrow(
                ()-> new InvalidToken("Password reset  is invalid ")
        );
        if(! userToken.getToken().equals(passwordResetRequest.getToken().trim()))
            throw  new InvalidToken("Password reset is invalid for the given username");

        if(token.getVerified()) throw  new InvalidToken("Already verified, you can login");

        var isVerified =false;

        try {
            if(token.getExpirationDate().getTime()-new Date().getTime()<=0) {
                var user = token.getUser();
                repository.delete(token);
                publisher.publishEvent(new PasswordResetEvent(user, url));
                throw  new InvalidToken("Password reset was expired , new reset is sent to email. Please check your email");
            }
            else {
                token.setVerified(true);
                repository.save(token);
                isVerified=true;
            }

        }catch (Exception e){
            CatchException.catchException(e);
        }


        return isVerified;
    }
  @Override
  public Optional<PasswordResetToken> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public Optional<PasswordResetToken> findByUserId(Long id) {
        return repository.findByUserId(id);
    }
}
