package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.exception.InvalidCredentials;
import com.Tour.exception.NotFoundException;
import com.Tour.model.Token;
import com.Tour.model.User;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.Tour.security.TokenType.ACCESS_TOKEN;

@Service
public class AuthenticationService {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private  UserService userService;

    @Autowired
    private TokenService tokenService;
    private String getRefreshFromCookie(HttpServletRequest request)  {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length==0)throw  new InvalidCredentials("Invalid credentials, try to re-log");
        var cookie=  cookies[0];
        if(cookie ==null ||!cookie.getName().equals("token")|| cookie.getValue()==null)  throw  new InvalidCredentials("Invalid credentials, try  to  re-log");
        return cookie.getValue();
    }
    public String refreshToken(HttpServletRequest request){

<<<<<<< HEAD

        var refresh_token = getRefreshFromCookie(request);
        if(refresh_token==null ) throw new InvalidCredentials("Credentials are not valid");


        String access_token = null;
=======
    public AuthenticationResponse refreshToken(String authHeader){
        System.out.println(authHeader);
        if(authHeader==null || !authHeader.startsWith("Bearer ")) throw new InvalidCredentials("Credentials are not valid");
        AuthenticationResponse response= new AuthenticationResponse(new HashMap<>());
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
        try {
           String username = jwtService.extractUsername(refresh_token);
           User user = userService.getUser(username);
           if (user == null) throw new NotFoundException("User not found");
           access_token = jwtService.generateAccessToken(user);
           if(!tokenService.revokeAllUserToken(user, ACCESS_TOKEN)) throw  new RuntimeException("Not all token are revoked");
           saveUserToken(user,access_token);

       }catch (Exception e){
            CatchException.catchException(e);
       }

       return access_token;
    }

    private void saveUserToken(User user, String jwt) {
        var token = Token.builder().user(user).token(jwt).tokenType(ACCESS_TOKEN).expired(false).revoked(false).build();
        tokenService.save(token);
    }


}
