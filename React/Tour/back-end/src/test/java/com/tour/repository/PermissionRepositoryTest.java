package com.tour.repository;

import com.tour.model.Permission;
import com.tour.utils.Permissions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Arrays;
import java.util.stream.IntStream;

import static com.tour.utils.Permissions.*;
@DataJpaTest
class PermissionRepositoryTest {
    @Autowired private PermissionRepository repository;
    private  Permission perm1,perm2,perm3,perm4;
   Permission []permissionList;
    @BeforeEach
    void setUp() {
         perm1 = Permission.builder().name(USER_WRITE.name()).build();
         perm2 = Permission.builder().name(USER_READ.name()).build();
        perm3 = Permission.builder().name(HOLIDAYPLAN_WRITE.name()).build();
        perm4 = Permission.builder().name(HOLIDAYPLAN_READ.name()).build();
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
    void CheckFindPermissionByCorrectName(int index, String permission) {
        var expectedOutput  = index==0?perm1:index==1?perm2:index==2?perm3:perm4;
        Assertions.assertEquals(expectedOutput,repository.findByName(permission));
    }
    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER_WRITE","1:USER_READ","2:HOLIDAYPLAN_WRITE","3:HOLIDAYPLAN_READ"})
    void CheckFindPermissionByNotCorrectName(int index, String permission) {
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
        var userPermissions = new Permissions[]{USER_WRITE, USER_READ, HOLIDAYPLAN_WRITE, HOLIDAYPLAN_READ};
        int size  = repository.findAll().size();
        IntStream.range(0,userPermissions.length).forEach(index-> {
            var expectedOutput  = size-(index+1);
            repository.deletePermission(userPermissions[index].name());
            Assertions.assertNull(repository.findByName(userPermissions[index].name()));
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