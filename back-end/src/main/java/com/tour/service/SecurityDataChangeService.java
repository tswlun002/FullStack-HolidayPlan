package com.tour.service;
import com.tour.dto.SecurityChangeDataEvent;
import com.tour.exception.CatchException;
import com.tour.exception.InvalidToken;
import com.tour.exception.NotFoundException;
import com.tour.model.SecurityDataChangeToken;
import com.tour.model.User;
import com.tour.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
@Slf4j
@Service
@RequiredArgsConstructor
public class SecurityDataChangeService implements ISecurityDataChange {
    private  final PasswordResetTokenRepository repository;
    private  final ApplicationEventPublisher publisher;
    private  final  int OTP_STRENGTH=4;
    @Value("${password.reset.expire.time:5}")
    private int EXPIRATION;
    @Override
    public SecurityDataChangeToken createToken(User user) {
        if(user==null)throw  new NotFoundException("User is not found");
        Calendar calendar =Calendar.getInstance();;
        calendar.setTimeInMillis(new Date().getTime());
        calendar.add(Calendar.MINUTE, EXPIRATION);
        AtomicBoolean isSaved = new AtomicBoolean(false);
        AtomicReference<SecurityDataChangeToken> token=new AtomicReference<>(null);
        var results=findByUserId(user.getId());

        results.ifPresent((token1)-> {

            if(!token1.getVerified()){
                token1.setExpirationDate(new Date(calendar.getTime().getTime()));
                token1.setOTP(generateOTP());
                token.set(repository.save(token1));
                isSaved.set(true);
            }
            else  repository.delete(token1);
        });
        if(isSaved.get())return  token.get();


        var passwordReset = SecurityDataChangeToken.builder().OTP(generateOTP()).user(user).verified(false)
                .expirationDate(new Date(calendar.getTime().getTime())).build();

        try{
            passwordReset=repository.save(passwordReset);
            isSaved.set(true);
        }
        catch (Exception e){
            CatchException.catchException(e);
        }
        return isSaved.get() ? passwordReset:null;
    }

    private  int generateOTP() {
        String numbers = "123456789";
        Random random = new Random();
        var buildOTP = new StringBuilder();
        for(int i = 0; i<OTP_STRENGTH ; i++) {
            buildOTP.append(numbers.charAt(random.nextInt(numbers.length())));
        }
        return Integer.parseInt(buildOTP.toString());
    }

    @Override
    public void delete(SecurityDataChangeToken token) {
        if(token==null)throw  new InvalidToken("Password reset is invalid ");
        repository.delete(token);
    }

    @Override
    public Optional<SecurityDataChangeToken> findByOTP(int OTP) {
        return repository.findByOTP(OTP) ;
    }

    @Override
    public boolean verify(int OTP, String username,SecurityChangeDataEvent event) {
        log.info("OTP : {} , username: {}",OTP,username);
        var token = findByOTP(OTP).orElseThrow(
                ()-> new InvalidToken("OTP code  is invalid")
        );
        var userToken = findByUsername(username).orElseThrow(
                ()-> new InvalidToken("No OTP associated with given username")
        );
        if(userToken.getOTP()!=OTP)
            throw  new InvalidToken("OTP is invalid for the given username");

        if(token.getVerified()) throw  new InvalidToken("OTP is already verified");

        var isVerified =false;

        try {
            if(token.getExpirationDate().getTime()-new Date().getTime()<=0) {
                repository.delete(token);

                publisher.publishEvent(event);
                throw  new InvalidToken("OTP  expired , new OTP is sent to email. Please check your email");
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
  public Optional<SecurityDataChangeToken> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public Optional<SecurityDataChangeToken> findByUserId(Long id) {
        return repository.getByUserId(id);
    }
}
