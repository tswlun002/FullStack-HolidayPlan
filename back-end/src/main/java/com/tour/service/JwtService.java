package com.tour.service;
import com.tour.dto.UserResponseToAdmin;
import com.tour.exception.*;
import com.tour.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.signing.key}")
    private String SECRET_KEY;
    @Value("${jwt.refresh.accessToken.period}")
    private double REFRESH_TOKEN_PERIOD;
    @Value("${jwt.access.accessToken.period}")
    private double ACCESS_TOKEN_PERIOD;
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
        return  buildJwtToken(extraClaims,user, ACCESS_TOKEN_PERIOD);
    }
    public String generateRefreshToken(User user) {
        if(user==null)throw new NullException("User is invalid");
        return  generateRefreshToken(new HashMap<>(),user);
    }
    private void getExtraClaims(Map<String, Object> extraClaims, User user){
        extraClaims.put("user",
                UserResponseToAdmin.builder().age(user.getAge())
                        .username(user.getUsername()).lastname(user.getLastname())
                        .firstname(user.getFirstname()).roles(user.getRoles()).permissions(user.getPermissions()).build());
    }
    public String generateRefreshToken(Map<String, Object> extraClaims, User user) {
        if(user==null)throw new NullException("User is invalid");
        if(extraClaims!=null && extraClaims.isEmpty()){
            getExtraClaims(extraClaims, user);
        }
        return  buildJwtToken(extraClaims,user, REFRESH_TOKEN_PERIOD);
    }
    private String buildJwtToken(  Map<String, Object> extraClaims,
                                   User user, double time){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date((long)( System.currentTimeMillis()+1000*time)))
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
