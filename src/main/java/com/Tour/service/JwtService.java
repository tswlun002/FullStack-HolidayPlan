package com.Tour.service;
import com.Tour.exception.*;
import com.Tour.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.signing.key}")
    private String SECRET_KEY;

    public String extractUsername(String token) {
        if(token==null || token.isEmpty())throw new NullException("Token is invalid");

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
        return  buildJwtToken(extraClaims,user, 15);
    }
    public String generateRefreshToken(User user) {
        if(user==null)throw new NullException("User is invalid");
        return  generateRefreshToken(new HashMap<>(),user);
    }
    public String generateRefreshToken(Map<String, Object> extraClaims, User user) {
        if(user==null)throw new NullException("User is invalid");
        return  buildJwtToken(extraClaims,user, 1440);
    }
    private String buildJwtToken(  Map<String, Object> extraClaims,
                                   User user, long time){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * time))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Key getSignInKey() {
        byte[]key = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(key);
    }
}
