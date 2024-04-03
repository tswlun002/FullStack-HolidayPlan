package com.tour.service;

import com.tour.exception.CatchException;
import com.tour.exception.InvalidCredentials;
import com.tour.exception.NotFoundException;
import com.tour.model.AccessToken;
import com.tour.model.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import static com.tour.security.TokenType.ACCESS_TOKEN;

@Service
public class AuthenticationService {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private  UserService userService;

    @Autowired
    private AccessTokenService accessTokenService;
    private String getRefreshFromCookie(HttpServletRequest request)  {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length==0)throw  new InvalidCredentials("Login session expired, please logout and login to renew session.");
        var cookie=  cookies[0];
        if(cookie ==null ||!cookie.getName().equals("accessToken")|| cookie.getValue()==null)  throw  new InvalidCredentials("Invalid credentials, try  to  re-log");
        return cookie.getValue();
    }
    public String refreshToken(HttpServletRequest request){


        var refresh_token = getRefreshFromCookie(request);
        if(refresh_token==null ) throw new InvalidCredentials("Refresh token access is invalid");

        String access_token = null;
        try {
           String username = jwtService.extractUsername(refresh_token);
           User user = userService.getUser(username);
           if (user == null) throw new NotFoundException("User not found with given refresh token access, if you changed please email logout and login.");
           if(!accessTokenService.revokeAllUserToken(user, ACCESS_TOKEN)) throw  new RuntimeException("Not all accessToken are revoked");
           access_token = jwtService.generateAccessToken(user);
           saveUserToken(user,access_token);

       }catch (Exception e){
            CatchException.catchException(e);
       }

       return access_token;
    }

    private void saveUserToken(User user, String jwt) {
        var token = AccessToken.builder().user(user).token(jwt).tokenType(ACCESS_TOKEN).expired(false).revoked(false).build();
        accessTokenService.save(token);
    }


}
