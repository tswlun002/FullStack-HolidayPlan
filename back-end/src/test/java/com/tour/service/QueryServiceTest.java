package com.tour.service;

import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.QueryStatus;
import com.tour.model.User;
import com.tour.model.UserQuery;
import com.tour.repository.UserQueryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static com.tour.model.QueryStatus.ACTIVE;
import static com.tour.model.QueryStatus.SOLVED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ExtendWith(MockitoExtension.class)
class QueryServiceTest {
    @Mock
    private UserQueryRepository repository;
    @Mock private  OnUser userObj;
    @Mock private ApplicationEventPublisher publisher;
    @InjectMocks
    private   QueryService service;
    @BeforeEach
    void setUp() {
         service = new QueryService(repository,userObj,publisher);
    }
    @ParameterizedTest
    @MethodSource("saveTestCase")
    void saveQuery(UserQuery query, String expectedOutPut) {
        if(query==null){
            var actual = assertThrows(NullException.class, ()->service.saveQuery(null));
            verify(repository,times(0)).save(any());
            assertThat(actual).isExactlyInstanceOf(NullException.class);
            assertThat(actual.getMessage()).isEqualTo(expectedOutPut);

        } else {
            var actual = service.saveQuery(query);
            verify(repository, times(1)).save(query);
            assertThat(actual).isEqualTo(Boolean.parseBoolean(expectedOutPut));
        }


    }
    Stream<Arguments> saveTestCase(){
        var user = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        return  Stream.of(
                Arguments.of(UserQuery.builder().user(user).queryDescription("znLFI23XOePI9oHGt60HxifBq").querySummary("2CDNRorY2efAAs73nwKX1hdSsFy9La6d6k399w2")
                        .queryStatus(ACTIVE).build(),"true"
                ),
                Arguments.of(null,"Cannot save null query")
        );
    }
    @ParameterizedTest
    @MethodSource("updateTestCase")
    void update(User user,UserQuery query, String response, QueryStatus status,String expected) {
        if(user==null){
            when(userObj.getUser(null)).thenReturn(null);
            var actual = assertThrows(NotFoundException.class,()->
                    service.updateQuery(null,query.getId(),response,status));
            verify(userObj, times(1)).getUser(null);
            verify(repository,never()).findByIdAndUserId(anyLong(),anyLong());
            verify(repository,never()).save(any());
            assertThat(actual).isExactlyInstanceOf(NotFoundException.class);
            assertThat(actual.getMessage()).isEqualTo(expected);

        }
        if(query==null && user !=null){
            when(userObj.getUser(user.getUsername())).thenReturn(user);
            when(repository.findByIdAndUserId(null,user.getId())).thenReturn(Optional.empty());
            var actual = assertThrows(NotFoundException.class, ()->service.updateQuery(user.getUsername(),null,response,status));
            verify(userObj, times(1)).getUser(user.getUsername());
            verify(repository, times(1)).findByIdAndUserId(null,user.getId());
            verify(repository,times(0)).save(any());
            assertThat(actual).isExactlyInstanceOf(NotFoundException.class);
            assertThat(actual.getMessage()).isEqualTo(expected);

        }
        else if(query !=null && user!=null){
            when(userObj.getUser(anyString())).thenReturn(user);
            when(repository.findByIdAndUserId(anyLong(),anyLong())).thenReturn(Optional.of(query));
            var actual = service.updateQuery(user.getUsername(),query.getId(),response,status);
            verify(userObj, times(1)).getUser(user.getUsername());
            verify(repository, times(1)).findByIdAndUserId(query.getId(),user.getId());
            verify(repository, times(1)).save(query);
            assertThat(actual).isEqualTo(Boolean.parseBoolean(expected));
        }


    }


    Stream<Arguments> updateTestCase(){
        var user = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var query =UserQuery.builder().id(1L).user(user).queryDescription("znLFI23XOePI9oHGt60HxifBq").querySummary("2CDNRorY2efAAs73nwKX1hdSsFy9La6d6k399w2")
                .queryStatus(ACTIVE).build();
        return  Stream.of(
                Arguments.of(user,query,"MCP9Jm9x0yIakCwTTqY06nS9A2h0YB3",SOLVED,"true"),
                Arguments.of(null,query,"Wq4AhWZ0h7bP9yr9DMxY6VJl3Ao",SOLVED,"User is not found"),
                Arguments.of(user,null,"MCP9Jm9x0yIakCwTTqY06nS9A2h0YB3",SOLVED,"Query is not found")

        );
    }
    @Test
    void findByQueryIdAndUsername(){
        var user =  (User)userAndQuery().get()[1];
        var query  =(UserQuery)userAndQuery().get()[0];
        when(repository.findByUsername(user.getUsername())).thenReturn(List.of(query));
        var actual  = service.findByUsername(user.getUsername());
        assertThat(actual).isEqualTo(List.of(query));
    }
    Arguments userAndQuery(){
        var user = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var query =UserQuery.builder().id(1L).user(user).queryDescription("znLFI23XOePI9oHGt60HxifBq").querySummary("2CDNRorY2efAAs73nwKX1hdSsFy9La6d6k399w2")
                .queryStatus(ACTIVE).build();
        return  Arguments.of(query, user);
    }



}