package com.tour.service;
import com.tour.exception.*;
import com.tour.model.AccessToken;
import com.tour.model.User;
import com.tour.repository.AccessTokenRepository;
import com.tour.security.TokenType;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
@AllArgsConstructor
public class AccessTokenService {
    private final AccessTokenRepository accessTokenRepository;
    public void save(@Valid AccessToken accessToken) {
        if(accessToken ==null)throw  new NullException("AccessToken is not invalid");
        accessTokenRepository.findByTokenName(accessToken.getToken())
                .ifPresent(t->{throw  new DuplicateException("AccessToken already exists");});
        try{
            accessTokenRepository.save(accessToken);
        }catch (Exception e){
            CatchException.catchException(e);
        }
    }
    public Optional<AccessToken> findByToken(String token) {
        var token1= accessTokenRepository.findByTokenName(token);
        if(token1.isEmpty())throw new NotFoundException("AccessToken is not found");
        return token1;
    }
    public List<AccessToken> findByAllValidToken(User user, TokenType tokenType) {
        if(user==null)throw new NullException("User is invalid");
        return accessTokenRepository.findValidTokenByUser(user.getId(),tokenType);
    }
    public boolean deleteAllToken(User user) {
        if (user == null) throw new NullException("User is invalid");
        var deleted  = false;
        try {
            var tokens  = accessTokenRepository.findAllTokenByUser(user.getId(), TokenType.REFRESH_TOKEN);
            if(! tokens.isEmpty()) accessTokenRepository.deleteAll(tokens);
            tokens = accessTokenRepository.findAllTokenByUser(user.getId(), TokenType.ACCESS_TOKEN);
            if(! tokens.isEmpty()) accessTokenRepository.deleteAll(tokens);
            deleted=true;
        } catch (Exception e) {
            CatchException.catchException(e);
        }
        return deleted;
    }
    public Boolean revokeToken(AccessToken accessToken) {
        if(accessToken ==null) throw new NullException("Can not revoke null accessToken");
        var  dbToken  = findByToken(accessToken.getToken());
        if(dbToken.isEmpty())throw new NotFoundException("AccessToken try to revoke can not be found");
        return dbToken.get().isRevoked() && dbToken.get().isExpired() || revoke(accessToken);
    }
    private  boolean revoke(AccessToken accessToken){
        var isRevoked =false;
        try{
            accessToken.setRevoked(true);
            accessToken.setExpired(true);
            accessTokenRepository.save(accessToken);
            isRevoked=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return isRevoked;
    }

    public boolean revokeAllUserToken(User user, TokenType tokenType) {
        if(user ==null)throw  new NullException("AccessToken of invalid user cannot be invoked");
        var validUserTokens  = findByAllValidToken(user, tokenType);
        if(validUserTokens.isEmpty())return true;
        return validUserTokens.stream().allMatch(this::revoke);

    }
}
