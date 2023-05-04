package com.Tour.repository;

import com.Tour.model.Token;
import com.Tour.security.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository  extends JpaRepository<Token, Long> {
    @Query("select t from Token t join fetch t.user " +
            "where t.token=:token and (t.expired=false or t.revoked=false)")
    List<Token> findValidByToken(String token);

    @Query("select t from Token t join fetch t.user u " +
            "where u.id=:userId and (t.revoked=false or t.expired=false ) and t.tokenType=:tokenType")
    List<Token> findValidByTokenByUser(long userId, TokenType tokenType);

    @Query("select t from Token t join fetch t.user u " +
            "where u.id=:userId and t.tokenType=:tokenType")
    List<Token> findAllByTokenByUser(long userId, TokenType tokenType);

    @Query("select t from Token t join fetch t.user " +
            "where t.token=:token")
    Optional<Token> findByToken(String token);
}
