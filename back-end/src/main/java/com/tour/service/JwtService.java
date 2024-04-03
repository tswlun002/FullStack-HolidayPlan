package com.tour.service;

import com.tour.dto.UserResponseToAdmin;
import com.tour.exception.NullException;
import com.tour.model.User;
import com.tour.security.TokenType;
import com.tour.utils.Constants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Slf4j
@Service
@AllArgsConstructor
public class JwtService {


   private  final  Environment environment;


    public String extractUsername(String token) {
        if(token==null || token.isEmpty())throw new NullException("AccessToken is invalid");

        return extractClaim(token, Claims::getSubject);
    }

    private <T>T  extractClaim(String token, Function<Claims,T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();

    }
    public String generateAccessToken(User user) {
        if(user==null)throw new NullException("User is invalid");
        return generateAccessToken(new HashMap<>(), user);
    }

    public String generateAccessToken(Map<String, Object> extraClaims, User user) {
        if(user==null)throw new NullException("User is invalid");
        if(extraClaims!=null && extraClaims.isEmpty()){
            getExtraClaims(extraClaims, user);
        }
        var ACCESS_TOKEN_PERIOD= Double.parseDouble(Objects.requireNonNull(environment.getProperty("jwt.access.accessToken.period")));
        log.info("----------------------------- Generate access_token -----------------------------------");
        return  buildJwtToken(extraClaims,user, ACCESS_TOKEN_PERIOD,TokenType.ACCESS_TOKEN);
    }
    public String generateRefreshToken(User user) {
        if(user==null)throw new NullException("User is invalid");
        return  generateRefreshToken(new HashMap<>(),user);
    }
    private void getExtraClaims(Map<String, Object> extraClaims, User user){
        extraClaims.put("user",
                UserResponseToAdmin.builder().age(user.getAge())
                        .username(user.getUsername()).lastname(user.getLastname())
                        .firstname(user.getFirstname()).roles(user.getRoles()).
                        permissions(user.getPermissions()).build());
    }
    public String generateRefreshToken(Map<String, Object> extraClaims, User user) {
        if(user==null)throw new NullException("User is invalid");
        if(extraClaims!=null && extraClaims.isEmpty()){
            getExtraClaims(extraClaims, user);
        }
        var REFRESH_TOKEN_PERIOD= Double.parseDouble(Objects.requireNonNull(environment.getProperty("jwt.refresh.accessToken.period")));
        log.info("----------------------------- Generate refresh_token: {} -----------------------------------",REFRESH_TOKEN_PERIOD);
        return  buildJwtToken(extraClaims,user,REFRESH_TOKEN_PERIOD,TokenType.REFRESH_TOKEN);
    }
    private String buildJwtToken(Map<String, Object> extraClaims,
                                 User user, double time, TokenType type){
        var currentTime= Constants.getCurrentTime();
        log.info("-------------------------- Current time: {}, calender: {}",currentTime, Calendar.getInstance(TimeZone.getTimeZone("Africa/Johannesburg")));

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setHeaderParam("type",type)
                .setIssuedAt(Date.from(currentTime))
                .setExpiration(
                        Date.from(currentTime.plusMillis(60000*(long)time)))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        var dateNow = Date.from(Constants.getCurrentTime());
        var tokenDate= extractExpiration(token);
        var isExpired = dateNow.equals(tokenDate)||dateNow.after(tokenDate);

        log.info("---------------------------- Token is expired: {} , token expire date:{}, date now:{}-------------------------",
                isExpired,tokenDate,dateNow);
        return isExpired;
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    public Date extractCreationTime(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }

    private Key getSignInKey() {
        byte[]key = Decoders.BASE64.decode(environment.getProperty("jwt.signing.key"));
        return Keys.hmacShaKeyFor(key);
    }
}
