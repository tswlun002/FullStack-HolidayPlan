package com.Tour.repository;

import com.Tour.model.Permission;
import com.Tour.model.Role;
import com.Tour.model.UserPermission;
import com.Tour.model.UserRole;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import static com.Tour.model.UserPermission.HOLIDAYPLAN_WRITE;
import static com.Tour.model.UserPermission.USER_WRITE;
import static com.Tour.model.UserRole.ADMIN;
import static com.Tour.model.UserRole.USER;


@DataJpaTest

class RolesRepositoryTest {


    @Autowired
    private RolesRepository repository;
    @Autowired
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
    void getRolesWithCorrectName(int index, UserRole userRole) {
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
        permissionRe.save(perm1);
        permissionRe.save(perm2);
        permissionRe.save(perm3);
        permissionRe.save(perm4);
        role.setPermissions(Set.of(perm1,perm2,perm3,perm4));
        role2.setPermissions(Set.of(perm1,perm2,perm4));
        permissionRe.findAll().forEach(p-> {
            System.out.println();
            if(p.getName()==HOLIDAYPLAN_WRITE)Assertions.assertArrayEquals(new Role[]{role},
                    repository.getRolesByPermission(p.getId()).toArray() );
            else Assertions.assertArrayEquals(roleList,
                    repository.getRolesByPermission(p.getId()).toArray() );

        });

    }

    @Test
    void getRolesByPermissionWithInvalidPermissionId(){
        var perm1 = Permission.builder().id(1L).name(USER_WRITE).build();
        var perm2 = Permission.builder().id(2L).name(UserPermission.USER_READ).build();
        var perm3 = Permission.builder().id(3L).name(UserPermission.HOLIDAYPLAN_WRITE).build();
        var perm4 = Permission.builder().id(5L).name(UserPermission.HOLIDAYPLAN_READ).build();


        permissionRe.save(perm2);
        permissionRe.save(perm3);
        permissionRe.save(perm4);

        List.of(perm1, perm2, perm3,perm4).forEach(p-> {
            System.out.println(p);
            Assertions.assertArrayEquals(Collections.EMPTY_SET.toArray(),
                    repository.getRolesByPermission(perm1.getId()).toArray());
        });

    }

    @Test
    void deletePermissionFromRoleWithValidPermissions() {
        var perm1 = Permission.builder().name(USER_WRITE).build();
        var perm2 = Permission.builder().name(UserPermission.USER_READ).build();
        var perm3 = Permission.builder().name(UserPermission.HOLIDAYPLAN_WRITE).build();
        var perm4 = Permission.builder().name(UserPermission.HOLIDAYPLAN_READ).build();
        permissionRe.save(perm1);
        permissionRe.save(perm2);
        permissionRe.save(perm3);
        permissionRe.save(perm4);
        role.setPermissions(Set.of(perm1,perm2,perm3,perm4));
        role2.setPermissions(Set.of(perm1,perm2,perm4));
        permissionRe.findAll().forEach(p-> {
            if(p.getName()==HOLIDAYPLAN_WRITE)
                repository.deletePermissionFromRole(role.getId(),p.getId() );
            else {
                repository.deletePermissionFromRole(role.getId(),p.getId());
                repository.deletePermissionFromRole(role2.getId(), p.getId());
            }
            Assertions.assertArrayEquals(Collections.EMPTY_SET.toArray(),
                    repository.getRolesByPermission(p.getId()).toArray());
            System.out.println(role);

        });

    }

    @Test
    void deleteRole() {
    }
}