package com.tour.repository;

import com.tour.model.Token;
import com.tour.model.User;
import com.tour.security.TokenType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.sql.Date;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
@DataJpaTest
class TokenRepositoryTest {

     @Autowired private TokenRepository repository;
    @Autowired private  UserRepository userRepository;
    private User user1, user2;
    private  Token token_1,token_2;
    boolean userFlag;

    @BeforeEach
    void setUp() {

        user1 = User.builder().age(new java.util.Date(Date.valueOf("1998-02-09").getTime())).firstname("Lunga")
                .lastname( "Tsewu").password("123456").username("lu01@mail.com").build();
        user2 =User.builder().age(new java.util.Date(Date.valueOf("1999-08-08").getTime())).firstname("Sakhe").
                lastname("Nombombo").password("123456").username("sakhe01@gmail.com").build();

         userRepository.saveAll(Set.of(user1,user2));
         token_1  = Token.builder().token("LungaTsewu").tokenType(TokenType.ACCESS_TOKEN).user(user1).
                expired(false).revoked(false).build();
         token_2  = Token.builder().token("WangaTsewu").tokenType(TokenType.REFRESH_TOKEN).user(user2).
                expired(false).revoked(false).build();

        repository.save(token_1);
        repository.save(token_2);
    }

    @AfterEach
    void tearDown() {
        repository.deleteAll();
        userRepository.deleteAll();
        token_1=token_2=null;
        user1=user2=null;
    }

    @Test
    void findValidTokenByValidUserId() {
        List.of(user1, user2).forEach(user ->
                {
                    userFlag = user.getFirstname().equals("Lunga");
                    var actual = repository.findValidTokenByUser(user.getId(),userFlag?
                            TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN);
                    Assertions.assertFalse(actual.isEmpty());
                    Assertions.assertEquals(1,actual.size());
                    var token  = actual.get(0);
                    Assertions.assertEquals(userFlag?TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN,
                            token.getTokenType());
                    var isValid  = token.isExpired() && token.isRevoked();
                    assertFalse(isValid);
                }
        );
    }
    @Test
    void findValidTokenByValidUserIdWhenUserTokenIsInvalid() {
        token_1.setExpired(true);
        token_2.setRevoked(true);
        repository.save(token_1);repository.save(token_2);
        List.of(user1, user2).forEach(user ->
                {
                    userFlag = user.getFirstname().equals("Lunga");
                    var actual = repository.findValidTokenByUser(user.getId(),userFlag?
                            TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN);
                    Assertions.assertTrue(actual.isEmpty());
                }
        );
    }

    @Test
    void findAllTokenByUserWhenTokenAreValid() {
        List.of(user1, user2).forEach(user ->
                {
                    userFlag = user.getFirstname().equals("Lunga");
                    var actual = repository.findAllTokenByUser(user.getId(),userFlag?
                            TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN);
                    Assertions.assertFalse(actual.isEmpty());
                    Assertions.assertEquals(1,actual.size());
                    var token  = actual.get(0);
                    Assertions.assertEquals(userFlag?TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN,
                            token.getTokenType());
                    var isValid  = token.isExpired() && token.isRevoked();
                    assertFalse(isValid);
                }
        );

    }
    @Test
    void findAllTokenByUserWhenTokenAreInValid() {
        token_1.setExpired(true);
        token_2.setRevoked(true);
        repository.save(token_1);repository.save(token_2);
        List.of(user1, user2).forEach(user ->
                {
                    userFlag = user.getFirstname().equals("Lunga");
                    var actual = repository.findAllTokenByUser(user.getId(),userFlag?
                            TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN);
                    Assertions.assertFalse(actual.isEmpty());
                    Assertions.assertEquals(1,actual.size());
                    var token  = actual.get(0);
                    Assertions.assertEquals(userFlag?TokenType.ACCESS_TOKEN:TokenType.REFRESH_TOKEN,
                            token.getTokenType());
                    var isValid  = token.isExpired() && token.isRevoked();
                    assertFalse(isValid);
                }
        );

    }

    @Test
    void findByTokenByValidName() {
        List.of(token_1, token_2).forEach(token ->
                {
                    var actual  = repository.findByTokenName(token.getToken());
                    assertTrue(actual.isPresent());
                    assertEquals(token, actual.get());
                }

        );
    }
    @ParameterizedTest
    @ValueSource(strings = {"tata","toko","mama"})
    void findByTokenByInValidName(String tokenName) {
        var actual  = repository.findByTokenName(tokenName);
        assertTrue(actual.isEmpty());

    }
}