package com.Tour.controller;

import com.Tour.model.Permission;
import com.Tour.model.Role;
import com.Tour.model.UserPermission;
import com.Tour.model.UserRole;
import com.Tour.repository.PermissionRepository;
import com.Tour.repository.RolesRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Arrays;
import java.util.Set;

import static com.Tour.model.UserPermission.HOLIDAYPLAN_WRITE;
import static com.Tour.model.UserPermission.USER_WRITE;
import static com.Tour.model.UserRole.ADMIN;
import static com.Tour.model.UserRole.USER;
import static org.mockito.Mockito.verify;

@DataJpaTest
@ExtendWith(MockitoExtension.class)
class RoleControllerTest {


    @Autowired
    private RolesRepository repository;
    @Mock
    private PermissionRepository permissionRe;
    private Role role, role2;
    Role[] roleList;

    @BeforeEach
    void setUp() {

        role = Role.builder().name(USER).build();
        role2 = Role.builder().name(ADMIN).build();

        repository.save(role);repository.save(role2);

        roleList = new Role[]{role, role2};
    }

    @AfterEach
    void tearDown() throws Exception {
        repository.deleteAll();
        role = role2 =null;
        roleList =null;

    }

    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER" ,"1:ADMIN"})
    void getRolesWithCorrectName(int index,UserRole userRole) {
        var expectedOutput  = index==0?role:role2;
        Assertions.assertEquals(expectedOutput,repository.getRole(userRole));
    }
    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER" ,"1:ADMIN"})
    void getRolesWithIncorrectName(int index,UserRole userRole) {

        var role_  = index==0?role:role2;
        repository.delete(role_);
        Assertions.assertNull(repository.getRole(userRole));
    }

    @Test
    void getRole() {
    }

    @ParameterizedTest
    @CsvSource(value = {"1","2"})
    void findByIdWithCorrectId(int index) {
        var role_  = index==0?role:role2;
        Assertions.assertEquals(role_,repository.getRole(role_.getId()));
    }
    @ParameterizedTest
    @CsvSource(value = {"-99","-500","-4","0"})
    void findByIdWithIncorrectId(int id) {
        Assertions.assertNull(repository.getRole(id));
    }

    @Test
    void getRolesByPermissionWithCorrectPermissionId(){
        var perm1 = Permission.builder().name(USER_WRITE).build();
        var perm2 = Permission.builder().name(UserPermission.USER_READ).build();
        var perm3 = Permission.builder().name(UserPermission.HOLIDAYPLAN_WRITE).build();
        var perm4 = Permission.builder().name(UserPermission.HOLIDAYPLAN_READ).build();
        perm1=permissionRe.save(perm1);
        perm2=permissionRe.save(perm2);
        perm3=permissionRe.save(perm3);
        perm4=permissionRe.save(perm4);
        role.setPermissions(Set.of(perm1,perm2,perm3,perm4));
        role2.setPermissions(Set.of(perm1,perm2,perm4));

        Arrays.stream((new Permission[]{perm1,
                perm2,
                perm3,
                perm4})).forEach(p-> {
            if(p.getName()==HOLIDAYPLAN_WRITE)Assertions.assertArrayEquals(new Role[]{role},
                    repository.getRolesByPermission(p.getId()).toArray() );
            else Assertions.assertArrayEquals(roleList,
                    repository.getRolesByPermission(p.getId()).toArray() );

        });

    }

    @Test
    void deletePermissionFromRole() {
    }

    @Test
    void deleteRole() {
    }
}