package com.Tour.repository;

import com.Tour.model.Permission;
<<<<<<< HEAD
import com.Tour.utils.Permissions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
=======
import com.Tour.model.UserPermission;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

<<<<<<< HEAD
import java.util.Arrays;
import java.util.stream.IntStream;

import static com.Tour.utils.Permissions.*;
=======
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

import static com.Tour.model.UserPermission.*;
import static org.junit.jupiter.api.Assertions.*;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
@DataJpaTest
class PermissionRepositoryTest {
    @Autowired private PermissionRepository repository;
    private  Permission perm1,perm2,perm3,perm4;
   Permission []permissionList;
    @BeforeEach
    void setUp() {
<<<<<<< HEAD
         perm1 = Permission.builder().name(USER_WRITE.name()).build();
         perm2 = Permission.builder().name(USER_READ.name()).build();
        perm3 = Permission.builder().name(HOLIDAYPLAN_WRITE.name()).build();
        perm4 = Permission.builder().name(HOLIDAYPLAN_READ.name()).build();
=======
         perm1 = Permission.builder().name(USER_WRITE).build();
         perm2 = Permission.builder().name(UserPermission.USER_READ).build();
        perm3 = Permission.builder().name(UserPermission.HOLIDAYPLAN_WRITE).build();
        perm4 = Permission.builder().name(UserPermission.HOLIDAYPLAN_READ).build();
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
        repository.save(perm1);repository.save(perm2);repository.save(perm3);repository.save(perm4);

        permissionList = new Permission[]{perm1, perm2, perm3, perm4};
    }

    @AfterEach
    void tearDown() {
         repository.deleteAll();
         perm1=perm2=perm3=perm4=null;
         permissionList=null;
    }

    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER_WRITE","1:USER_READ","2:HOLIDAYPLAN_WRITE","3:HOLIDAYPLAN_READ"})
<<<<<<< HEAD
    void CheckFindPermissionByCorrectName(int index, String permission) {
=======
    void CheckFindPermissionByCorrectName(int index, UserPermission permission) {
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
        var expectedOutput  = index==0?perm1:index==1?perm2:index==2?perm3:perm4;
        Assertions.assertEquals(expectedOutput,repository.findByName(permission));
    }
    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER_WRITE","1:USER_READ","2:HOLIDAYPLAN_WRITE","3:HOLIDAYPLAN_READ"})
<<<<<<< HEAD
    void CheckFindPermissionByNotCorrectName(int index, String permission) {
=======
    void CheckFindPermissionByNotCorrectName(int index, UserPermission permission) {
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
        var expectedOutput  = index==0?perm1:index==1?perm2:index==2?perm3:perm4;
        repository.delete(expectedOutput);
        Assertions.assertNull(repository.findByName(permission));
    }

    @ParameterizedTest
    @CsvSource(value = {"0","1","2","3"})
    void findByIdWithCorrectId(int index) {

        var expectedOutput  = index==0?perm1:index==1?perm2:index==2?perm3:perm4;
        long id = expectedOutput.getId();
        Assertions.assertEquals(expectedOutput,repository.findById(id));
    }
    @ParameterizedTest
    @CsvSource(value = {"0","-1","-2","-3"})
    void findByIdWithNotCorrectId(int id) {
        Assertions.assertNull(repository.findById(id));
    }


    @Test
    void deletePermission() {
<<<<<<< HEAD
        var userPermissions = new Permissions[]{USER_WRITE, USER_READ, HOLIDAYPLAN_WRITE, HOLIDAYPLAN_READ};
        int size  = repository.findAll().size();
        IntStream.range(0,userPermissions.length).forEach(index-> {
            var expectedOutput  = size-(index+1);
            repository.deletePermission(userPermissions[index].name());
            Assertions.assertNull(repository.findByName(userPermissions[index].name()));
=======
        var userPermissions = new UserPermission[]{USER_WRITE, USER_READ, HOLIDAYPLAN_WRITE, HOLIDAYPLAN_READ};
        int size  = repository.findAll().size();
        IntStream.range(0,userPermissions.length).forEach(index-> {
            var expectedOutput  = size-(index+1);
            repository.deletePermission(userPermissions[index]);
            Assertions.assertNull(repository.findByName(userPermissions[index]));
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
            Assertions.assertEquals(expectedOutput, repository.findAll().size());
        });
        Assertions.assertEquals(0, repository.findAll().size());


    }

    @Test
    void findAllPermissions() {
          Assertions.assertEquals(permissionList.length, repository.findAllPermissions().size());
          Assertions.assertArrayEquals(Arrays.stream(permissionList).sorted().toArray(), repository.findAllPermissions().stream().sorted().toArray());
    }
}