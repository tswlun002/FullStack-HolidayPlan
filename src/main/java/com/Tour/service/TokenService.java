package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.exception.InvalidCredentials;
import com.Tour.exception.NotFoundException;
import com.Tour.exception.NullException;
import com.Tour.model.Token;
import com.Tour.model.User;
import com.Tour.repository.TokenRepository;
import com.Tour.security.TokenType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;
    public Optional<Token> findByToken(String token) {
        if(token ==null||token.isBlank() || token.isEmpty() )throw new InvalidCredentials("Token is invalid");
        var token1= tokenRepository.findByToken(token);
        if(token1.isEmpty())throw new NotFoundException("Token is not found");
        return token1;
    }

    public void save(Token token) {
        if(token==null)throw  new NullException("Token is not invalid");
        try{
            tokenRepository.save(token);
        }catch (Exception e){
            CatchException.catchException(e);
        }
    }

    public List<Token> findByAllValidToken(User user, TokenType tokenType) {
        if(user==null)throw new NullException("User is invalid");
        return tokenRepository.findValidByTokenByUser(user.getId(),tokenType);
    }

    public void deleteAllToken(User user) {
        if(user==null)throw new NullException("User is invalid");
        tokenRepository.deleteAll(tokenRepository.findAllByTokenByUser(user.getId(),TokenType.REFRESH_TOKEN));
        tokenRepository.deleteAll(tokenRepository.findAllByTokenByUser(user.getId(),TokenType.ACCESS_TOKEN));
    }
}
