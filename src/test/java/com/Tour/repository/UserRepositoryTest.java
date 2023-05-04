package com.Tour.repository;

import com.Tour.model.User;
import com.Tour.model.UserType;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.sql.Date;


@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private  UserRepository userRepository;
     private User user1, user2, user3;

    @BeforeEach
    void beforeEach(){
        user1 = User.builder().age(new java.util.Date(Date.valueOf("1998-02-09").getTime())).firstname("Lunga")
               .lastname( "Tsewu").password("123456").userType(UserType.ADMIN).username("lu01@mail.com").build();

        user2 =User.builder().age(new java.util.Date(Date.valueOf("1999-08-08").getTime())).firstname("Sakhe").
                lastname("Nombombo").password("123456").userType(UserType.ADMIN).username("sakhe01@gmail.com").build();

        user3 =User.builder().age(new java.util.Date(Date.valueOf("2001-04-07").getTime())).firstname("Buhle").
                lastname("Buhle").password("123456").userType(UserType.USER).username("bu01@gmail.com").build();

       userRepository.save(user1); userRepository.save(user2);userRepository.save(user3);

    }
    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
        user2=null; user3=null; user1=null;
    }

    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"1:lu01@mail.com","3:sakhe01@gmail.com","2:bu01@gmail.com"})
    void CheckGetCorrectUserByUserName(int index, String username) {

        var user = index==1?user1:
                index==2?user2:user3;
        Assertions.assertEquals(user,userRepository.getUser(username));
    }
    @Disabled
    @Test
    void CheckGetIncorrectUser() {
    }

    @Test
    void testGetUser() {
    }

    @Test
    void getUsers() {
    }

    @Test
    void getUsersByRole() {
    }

    @Test
    void deleteRoleFromUser() {
    }

    @Test
    void findAllUser() {
    }
}