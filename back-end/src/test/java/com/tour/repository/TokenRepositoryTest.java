package com.tour.repository;

import com.tour.model.Token;
import com.tour.model.User;
import com.tour.security.TokenType;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.sql.Date;
import java.util.Arrays;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DataJpaTest
class TokenRepositoryTest {

    @Autowired private TokenRepository repository;
    @Autowired private  UserRepository userRepository;

    boolean userFlag;

    @ParameterizedTest
    @MethodSource("getArgs")
    void findValidTokenByValidUserId(Token token) {
        var user = token.getUser();
        saveToken(user, token);
        userFlag = user.getFirstname().equals("Lunga");
        var actual = repository.findValidTokenByUser(user.getId(), userFlag ?
        TokenType.ACCESS_TOKEN : TokenType.REFRESH_TOKEN);
        Assertions.assertFalse(actual.isEmpty());
        Assertions.assertEquals(1, actual.size());
        Assertions.assertEquals(userFlag ? TokenType.ACCESS_TOKEN : TokenType.REFRESH_TOKEN,
        token.getTokenType());
        var isValid = token.isExpired() && token.isRevoked();
        assertFalse(isValid);
        deleteToken();

    }

    @ParameterizedTest
    @MethodSource("getArgs")
    void findValidTokenByValidUserIdWhenUserTokenIsInvalid(Token token) {
        token.setExpired(true);
        token.setRevoked(true);
        var user = token.getUser();
        saveToken(user, token);
        userFlag = user.getFirstname().equals("Lunga");
        var actual = repository.findValidTokenByUser(user.getId(),userFlag?
                TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN);
        Assertions.assertTrue(actual.isEmpty());
        deleteToken();

    }

    @ParameterizedTest
    @MethodSource("getArgs")
    void findAllTokenByUserWhenTokenAreValid(Token token) {

        var user = token.getUser();
        saveToken(user, token);
        userFlag = user.getFirstname().equals("Lunga");
        var actual = repository.findAllTokenByUser(user.getId(),userFlag?
                TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN);
        Assertions.assertFalse(actual.isEmpty());
        Assertions.assertEquals(1,actual.size());
        var token_out  = actual.get(0);
        Assertions.assertEquals(userFlag?TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN,
                token_out.getTokenType());
        var isValid  = token_out.isExpired() && token_out.isRevoked();
        assertFalse(isValid);
        deleteToken();

    }
    @ParameterizedTest
    @MethodSource("getArgs")
    void findAllTokenByUserWhenTokenAreInValid(Token token) {
        token.setExpired(true);
        token.setRevoked(true);
        var user = token.getUser();
        saveToken(user, token);
        userFlag = user.getFirstname().equals("Lunga");
        var actual = repository.findAllTokenByUser(user.getId(),userFlag?
                TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN);
        Assertions.assertFalse(actual.isEmpty());
        Assertions.assertEquals(1,actual.size());
        var token_out  = actual.get(0);
        Assertions.assertEquals(userFlag?TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN,
                token_out.getTokenType());
        var isInvalid  = token_out.isExpired() && token.isRevoked();
        assertTrue(isInvalid);
        deleteToken();
    }

    @ParameterizedTest
    @MethodSource("getArgs")
    void findByTokenByValidName(Token token) {
            saveToken(token.getUser(), token);
            var actual  = repository.findByTokenName(token.getToken());
            assertTrue(actual.isPresent());
            assertEquals(token, actual.get());
            deleteToken();
    }
    @ParameterizedTest
    @MethodSource("getArgs")
    void findByTokenByInValidName(Token token) {
        saveToken(token.getUser(), token);
        String [] names ={"tata","toko","mama"};
        Arrays.stream(names).forEach(name->{
            var actual  = repository.findByTokenName(name);
            assertTrue(actual.isEmpty());
        });
        deleteToken();

    }

    Stream<Arguments> getArgs(){
       var user1 = User.builder().age(new java.util.Date(Date.valueOf("1998-02-09").getTime())).firstname("Lunga")
                .lastname( "Tsewu").password("123456").username("lu01@mail.com").build();
       var user2 =User.builder().age(new java.util.Date(Date.valueOf("1999-08-08").getTime())).firstname("Sakhe").
                lastname("Nombombo").password("123456").username("sakhe01@gmail.com").build();

        var token_1  = Token.builder().token("38782F413F4428472B4B6250645367566B5970404E635266556A586E32723575").
                tokenType(TokenType.ACCESS_TOKEN).user(user1).
                expired(false).revoked(false).build();
        var token_2  = Token.builder().token("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970").
                tokenType(TokenType.REFRESH_TOKEN).user(user2).
                expired(false).revoked(false).build();

        return  Stream.of(Arguments.of(token_1), Arguments.of(token_2));
    }
    void saveToken(User user, Token token){
        user= userRepository.save(user);
        token.setUser(user);
        repository.save(token);
    }
    void deleteToken(){
        repository.deleteAll();
        if(repository.count()==0)userRepository.deleteAll();
    }
}