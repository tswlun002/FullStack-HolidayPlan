package com.tour.service;

import com.tour.exception.DuplicateException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.Token;
import com.tour.model.User;
import com.tour.repository.TokenRepository;
import com.tour.security.TokenType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static com.tour.security.TokenType.ACCESS_TOKEN;
import static com.tour.security.TokenType.REFRESH_TOKEN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {
     @Mock private TokenRepository repository;
     @InjectMocks private  TokenService service;

    @BeforeEach
    void setUp() {
        service = new TokenService(repository);
    }
    @Test
    void saveToken() {
        var user  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("31c99GfJ222pS8WJdGZgiM8sJPFSSbl2D55pFj2r3X2wYz87cY").expired(false).
                tokenType(REFRESH_TOKEN).revoked(false).user(user).build();
        when(repository.findByTokenName(token.getToken())).thenReturn(Optional.empty());
        service.save(token);
        verify(repository,times(1)).findByTokenName(token.getToken());
        ArgumentCaptor<Token> captor = ArgumentCaptor.forClass(Token.class);
        verify(repository,times(1)).save(captor.capture());
        assertThat(captor.getValue()).isEqualTo(token);
    }

    @Test
    void saveNullToken() {
        var actual  = assertThrows(NullException.class, ()->service.save(null));
        verify(repository,times(0)).findByTokenName(anyString());
        verify(repository,times(0)).save(any());
        assertThat(actual).isExactlyInstanceOf(NullException.class);
        assertThat(actual.getMessage()).isEqualTo("Token is not invalid");
    }
    @Test
    void saveDuplicateToken() {
        var user  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(false).
                tokenType(ACCESS_TOKEN).revoked(false).user(user).build();
        when(repository.findByTokenName(token.getToken())).thenReturn(Optional.of(token));
        var actual  = assertThrows(DuplicateException.class, ()->service.save(token));
        verify(repository,times(1)).findByTokenName(token.getToken());
        verify(repository,times(0)).save(any());
        assertThat(actual).isExactlyInstanceOf(DuplicateException.class);
        assertThat(actual.getMessage()).isEqualTo("Token already exists");
    }

    @Test
    void findByTokenExists() {
        var user  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(false).
                tokenType(ACCESS_TOKEN).revoked(false).user(user).build();
        when(repository.findByTokenName(token.getToken())).thenReturn(Optional.of(token));
        var actual  =service.findByToken(token.getToken());
        verify(repository, times(1)).findByTokenName(token.getToken());
        assertThat(actual.isPresent()).isEqualTo(true);
        assertThat(actual.get()).isEqualTo(token);
    }
    @Test
    void findByTokenDoesNotExists() {
        var user  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(false).
                tokenType(ACCESS_TOKEN).revoked(false).user(user).build();
        when(repository.findByTokenName(token.getToken())).thenReturn(Optional.empty());
        var actual  = assertThrows(NotFoundException.class, ()->service.findByToken(token.getToken()));
        verify(repository, times(1)).findByTokenName(token.getToken());
        assertThat(actual).isExactlyInstanceOf(NotFoundException.class);
        assertThat(actual.getMessage()).isEqualTo("Token is not found");
    }

    @ParameterizedTest
    @ValueSource(strings = {"ACCESS_TOKEN","REFRESH_TOKEN"})
    void findByAllValidToken(String type) {
        var user  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(false).
                tokenType(TokenType.valueOf(type)).revoked(false).user(user).build();
        when(repository.findValidTokenByUser(user.getId(),TokenType.valueOf(type))).thenReturn(List.of(token));
        var actual  =service.findByAllValidToken(user,TokenType.valueOf(type));
        assertThat(!actual.isEmpty()).isEqualTo(true);
        assertThat(List.of(token)).isEqualTo(actual);
    }

    @Test
    void deleteAllToken() {
        var user  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var accessToken = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(false).
                tokenType(ACCESS_TOKEN).revoked(false).user(user).build();
        var refreshToken = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(false).
                tokenType(REFRESH_TOKEN).revoked(false).user(user).build();
        when(repository.findAllTokenByUser(user.getId(),ACCESS_TOKEN)).thenReturn(List.of(accessToken));
        when(repository.findAllTokenByUser(user.getId(),REFRESH_TOKEN)).thenReturn(List.of(refreshToken));
        var actual  = service.deleteAllToken(user);
        verify(repository, times(1)).findAllTokenByUser(user.getId(),ACCESS_TOKEN);
        verify(repository, times(1)).findAllTokenByUser(user.getId(),REFRESH_TOKEN);
        verify(repository, times(1)).deleteAll(List.of(accessToken));
        verify(repository, times(1)).deleteAll(List.of(refreshToken));
        assertThat(actual).isEqualTo(true);
    }


    @ParameterizedTest
    @ValueSource(strings = {"ACCESS_TOKEN","REFRESH_TOKEN"})
    void revokeToken(String type) {
        var user  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(false).
                tokenType(TokenType.valueOf(type)).revoked(false).user(user).build();
        when(repository.findByTokenName(token.getToken())).thenReturn(Optional.of(token));
        var actual  =service.revokeToken(token);
        token.setRevoked(true);
        token.setExpired(true);
        verify(repository, times(1)).save(token);
        assertThat(actual).isEqualTo(true);
    }
    @ParameterizedTest
    @ValueSource(strings = {"ACCESS_TOKEN","REFRESH_TOKEN"})
    void revokeExpiredAndRevokedToken(String type) {
        var user  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(true).
                tokenType(TokenType.valueOf(type)).revoked(true).user(user).build();
        when(repository.findByTokenName(token.getToken())).thenReturn(Optional.of(token));
        var actual  =service.revokeToken(token);
        token.setRevoked(true);
        token.setExpired(true);
        verify(repository, times(0)).save(any());
        assertThat(actual).isEqualTo(true);
    }

    @ParameterizedTest
    @ValueSource(strings = {"ACCESS_TOKEN","REFRESH_TOKEN"})
    void revokeAllUserToken(String type) {
        TokenType tokenType = TokenType.valueOf(type);
        var user  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var token = Token.builder().token("77HJ59l7DF2v4U529XZ217").expired(true).
                tokenType(tokenType).revoked(true).user(user).build();
        when(repository.findValidTokenByUser(user.getId(),tokenType)).thenReturn(List.of(token));
        var actual  =service.revokeAllUserToken(user,tokenType);
        verify(repository, times(1)).save(token);
        assertThat(actual).isEqualTo(true);
    }

}