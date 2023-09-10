package com.tour.repository;

import com.tour.model.AccessToken;
import com.tour.security.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {


    @Query("select t from AccessToken t join fetch t.user u " +
            "where u.id=:userId and t.revoked=false and t.expired=false  and t.tokenType=:tokenType")
    List<AccessToken> findValidTokenByUser(long userId, TokenType tokenType);

    @Query("select t from AccessToken t join fetch t.user u " +
            "where u.id=:userId and t.tokenType=:tokenType")
    List<AccessToken> findAllTokenByUser(long userId, TokenType tokenType);

    @Query("select t from AccessToken t join fetch t.user " +
            "where t.token=:token")
    Optional<AccessToken> findByTokenName(String token);
}
