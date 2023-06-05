package com.Tour.service;
import com.Tour.exception.*;
import com.Tour.model.Token;
import com.Tour.model.User;
import com.Tour.repository.TokenRepository;
import com.Tour.security.TokenType;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
@AllArgsConstructor
public class TokenService {
    private final TokenRepository tokenRepository;
    public void save(@Valid Token token) {
        if(token==null)throw  new NullException("Token is not invalid");
        var token1 = tokenRepository.findByTokenName(token.getToken());
        if(token1.isPresent()) throw  new DuplicateException("Token already exists");
        try{
            tokenRepository.save(token);
        }catch (Exception e){
            CatchException.catchException(e);
        }
    }
    public Optional<Token> findByToken(String token) {
        var token1= tokenRepository.findByTokenName(token);
        if(token1.isEmpty())throw new NotFoundException("Token is not found");
        return token1;
    }
    public List<Token> findByAllValidToken(User user, TokenType tokenType) {
        if(user==null)throw new NullException("User is invalid");
        return tokenRepository.findValidTokenByUser(user.getId(),tokenType);
    }
    public boolean deleteAllToken(User user) {
        if (user == null) throw new NullException("User is invalid");
        var deleted  = false;
        try {
            var tokens  = tokenRepository.findAllTokenByUser(user.getId(), TokenType.REFRESH_TOKEN);
            if(! tokens.isEmpty())tokenRepository.deleteAll(tokens);
            tokens =tokenRepository.findAllTokenByUser(user.getId(), TokenType.ACCESS_TOKEN);
            if(! tokens.isEmpty())tokenRepository.deleteAll(tokens);
            deleted=true;
        } catch (Exception e) {
            CatchException.catchException(e);
        }
        return deleted;
    }
    public Boolean revokeToken(Token token) {
        if(token ==null) throw new NullException("Can not revoke null token");
        var  dbToken  = findByToken(token.getToken());
        if(dbToken.isEmpty())throw new NotFoundException("Token try to revoke can not be found");
        return dbToken.get().isRevoked() && dbToken.get().isExpired() || revoke(token);
    }
    private  boolean revoke(Token token){
        var isRevoked =false;
        try{
            token.setRevoked(true);
            token.setExpired(true);
            tokenRepository.save(token);
            isRevoked=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return isRevoked;
    }

    public boolean revokeAllUserToken(User user, TokenType tokenType) {
        if(user ==null)throw  new NullException("Token of invalid user cannot be invoked");
        var validUserTokens  = findByAllValidToken(user, tokenType);
        if(validUserTokens.isEmpty())return true;
        return validUserTokens.stream().allMatch(this::revoke);

    }
}
