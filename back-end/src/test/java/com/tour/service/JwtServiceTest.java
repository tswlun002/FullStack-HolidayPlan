package com.tour.service;

import com.tour.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.env.Environment;
import java.time.Instant;
import java.util.Date;
import java.util.stream.Stream;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(MockitoExtension.class)
class JwtServiceTest {
    @Mock
    static Environment environment;
    @InjectMocks
    private  JwtService service;
    @Mock
    User user;

    @BeforeEach
    void setUp() {

        user     = User.builder().age(Date.from(Instant.now())).username("1998tsewu@gmail.com").firstname("Lunga").lastname("Tsewu").roles(null)
                .password("12233444").permissions(null).roles(null).build();
        service = new JwtService(environment);

    }
    @ParameterizedTest
    @MethodSource("getPeriods")
    public void generateAccessToken(long accessPeriod){
        when(environment.getProperty("jwt.access.accessToken.period")).thenReturn(String.valueOf(accessPeriod));
        when(environment.getProperty("jwt.signing.key")).thenReturn("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        var access_token = service.generateAccessToken(user);
        assertThat(service.extractUsername(access_token)).isEqualTo(user.getUsername());
        var expected =Date.from(service.extractCreationTime(access_token).toInstant().plusSeconds(60 *accessPeriod));
        assertThat(expected).isEqualTo(service.extractExpiration(access_token));
    }
    @ParameterizedTest
    @MethodSource("getPeriods")
    public void generateRefreshToken(long periods){
        when(environment.getProperty("jwt.refresh.accessToken.period")).thenReturn(String.valueOf(periods));
        when(environment.getProperty("jwt.signing.key")).thenReturn("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        var access_token = service.generateRefreshToken(user);
        assertThat(service.extractUsername(access_token)).isEqualTo(user.getUsername());
        var expected =Date.from(service.extractCreationTime(access_token).toInstant().plusSeconds(60*periods));
        assertThat(expected).isEqualTo(service.extractExpiration(access_token));
    }

    private Stream<Arguments> getPeriods(){
        return Stream.of(Arguments.of(1,3,4,4,5,66,7,7,78,8,88,899,9,99,7));
    }
}