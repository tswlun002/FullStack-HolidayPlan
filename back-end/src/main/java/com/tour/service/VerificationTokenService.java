package com.tour.service;

import com.tour.dto.RegisterEvent;
import com.tour.exception.CatchException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.VerificationToken;
import com.tour.repository.VerificationTokenRepository;
import com.tour.utils.VerificationURL;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class VerificationTokenService implements  OnVerificationToken {
    private  final VerificationTokenRepository repository;
    private final ApplicationEventPublisher publisher;
    /**
     * saves the VerificationToken
     * @param token is VerificationToken to save
     * @throws  NullException if the token given is null
     * @return true if token is saved else false
     */
    @Override
    public boolean saveToken(VerificationToken token) {
           if(token==null)throw  new NullException("VerificationToken is null/invalid");
           var saved =false;
           try{
               repository.save(token);
               saved=true;

           }
           catch (Exception e){
               CatchException.catchException(e);
           }
           return saved;

    }

    /**
     * Find VerificationToken by token
     * @param token of VerificationToken to find
     * @return Optional of VerificationToken
     */
    @Override
    public Optional<VerificationToken> findByToken(String token) {
        return repository.findByToken(token);
    }

    /**
     * Delete verification token
     * @param token is the token to delete
     * @throws  NotFoundException if the token to delete is not found
     * @return true if token is deleted else false
     */
    @Override
    public boolean deleteToken(String token) {
        var token1= this.findByToken(token).
                orElseThrow(()-> new NotFoundException("VerificationToken is not found"));
        var isDeleted=false;
        try{
            repository.delete(token1);
            isDeleted=true;
        }
        catch(Exception e){
            CatchException.catchException(e);
        }


        return isDeleted;
    }

    /**
     * Verifies token
     * If  token already expired , delete existing token and issue register event
     * @param token is the verification token
     * @param url is the url of verification token
     * @throws  NullException if the Verification token is null
     * @throws  RuntimeException if the token is already verified
     * @return  true the token is verified else false
     */
    @Override
    public boolean verifyToken(VerificationToken token, VerificationURL url) {
         if(token==null) throw  new NullException("Verification token is null");
         if(token.getIsVerified()) throw  new RuntimeException("Already verified, you can login");
         var isVerified =false;

         try {
             if(token.getExpirationDate().getTime()-new Date().getTime()<=0) {
                 var user = token.getUser();
                 repository.delete(token);
                 publisher.publishEvent(new RegisterEvent(user, url.toString()));
                 throw  new NullException("Verification was expired , new verification is sent to email. Please check your email");
             }
             else {
                 token.setIsVerified(true);
                 repository.save(token);
                 isVerified=true;
             }

         }catch (Exception e){
             CatchException.catchException(e);
         }


         return isVerified;

    }


}
