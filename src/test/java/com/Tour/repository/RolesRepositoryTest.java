package com.Tour.repository;

import com.Tour.model.Permission;
import com.Tour.model.Role;
<<<<<<< HEAD
=======
import com.Tour.model.UserPermission;
import com.Tour.model.UserRole;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
<<<<<<< HEAD
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import static com.Tour.utils.Roles.ADMIN;
import static com.Tour.utils.Roles.USER;
import static com.Tour.utils.Permissions.*;


@DataJpaTest
class RolesRepositoryTest {
=======
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


>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
    @Autowired
    private RolesRepository repository;
    @Autowired
    private PermissionRepository permissionRe;
<<<<<<< HEAD
    private Role role_user, role2_admin;
    private Role[] roleList;
    private  Set<Permission> permissionsSet ;

    @BeforeEach
    void setUp() {
         MockitoAnnotations.openMocks(this);
        role_user = Role.builder().name(USER.name()).build();
        role2_admin = Role.builder().name(ADMIN.name()).build();
        permissionsSet =new HashSet<>();

        Permission p1=Permission.builder().name(USER_WRITE.name()).build(),
                p2= Permission.builder().name(USER_READ.name()).build(),
               p3= Permission.builder().name(HOLIDAYPLAN_WRITE.name()).build(),
               p4= Permission.builder().name(HOLIDAYPLAN_READ.name()).build();


        permissionsSet.addAll(Set.of(p1,p2,p3,p4)

         );
         permissionRe.saveAll(permissionsSet);

         role_user.getPermissions().addAll(permissionsSet);
        role2_admin.getPermissions().addAll(Set.of(
               p3,p4
        ));

        repository.save(role_user);
        repository.save(role2_admin);

        roleList = new Role[]{role_user, role2_admin};
    }

    @AfterEach
    void tearDown(){
        repository.deleteAll();
        role_user = role2_admin =null;
        permissionsSet.clear();
        permissionsSet=null;
        roleList =null;
        permissionRe.deleteAll();
=======
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

>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
    }

    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER" ,"1:ADMIN"})
<<<<<<< HEAD
    void getRolesWithCorrectName(int index, String role) {
        var expectedOutput  = index==0? role_user : role2_admin;
       Assertions.assertEquals(expectedOutput,repository.getRole(role));
    }
    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER" ,"1:ADMIN"})
    void getRolesWithNameDoesNotExist(int index, String role) {
        var role_  = index==0? role_user : role2_admin;
        role_.getPermissions().forEach(p->repository.deletePermissionFromRole(role_.getId(),p.getId()));
        role_.getPermissions().clear();
        permissionRe.deleteAll();
        repository.deleteAll();
        Assertions.assertNull(repository.getRole(role));
=======
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
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
    }

    @ParameterizedTest
    @CsvSource(value = {"1","2"})
    void findByIdWithCorrectId(int index) {
<<<<<<< HEAD
        var role_  = index==0? role_user : role2_admin;
=======
        var role_  = index==0?role:role2;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
        Assertions.assertEquals(role_,repository.getRole(role_.getId()));
    }
    @ParameterizedTest
    @CsvSource(value = {"-99","-500","-4","0"})
    void findByIdWithIncorrectId(int id) {
        Assertions.assertNull(repository.getRole(id));
    }
<<<<<<< HEAD
    @ParameterizedTest
    @CsvSource(value = {"USER","ADMIN"})
    void checkRoleExitsByCorrectName(String name){
        Assertions.assertTrue(repository.checkRoleExitsByName(name));
    }
    @ParameterizedTest
    @CsvSource(value = {"USER","ADMIN"})
    void checkRoleExitsByIncorrectName(String name){
        repository.deleteAll();
        Assertions.assertFalse(repository.checkRoleExitsByName(name));
    }
    @Test
    void getRolesByCorrectPermissionId(){

        for(var permission : permissionsSet){
            //If permission is user read|write, it will return 1 role else 2 roles
            var expectedNumberRoles = (permission.getName().equals(USER_WRITE.name()) || permission.getName().equals(USER_READ.name())) ?1:2;
            //expected role list
            var expectedRolesList = (permission.getName().equals(USER_WRITE.name()) || permission.getName().equals(USER_READ.name())) ?
                    new Role[]{role_user}:new Role[]{role2_admin, role_user};

            var list =   repository.getRolesByPermission(permission.getName()).stream().sorted(
                    Comparator.comparing(Role::getName)
            ).toArray();
            var size = list.length;
            Assertions.assertArrayEquals(expectedRolesList,list);

            Assertions.assertEquals(expectedNumberRoles, size);
        }
    }

    @Test
    void getRolesByPermissionIdThatDoesNotExits(){
        permissionRe.deleteAll();
       for(var r: roleList){
            r.setPermissions(Set.of());

        }
        for(var permission : permissionsSet){

          var list =   repository.getRolesByPermission(permission.getName()).stream().sorted(
                    Comparator.comparing(p -> p.getName())
            ).toArray();
            var size = list.length;
            Assertions.assertArrayEquals(new Permission[]{},list);

            Assertions.assertEquals(0, size);
        }
=======

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

>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
    }

    @Test
    void deletePermissionFromRoleWithValidPermissions() {
<<<<<<< HEAD
        var p1= permissionsSet.stream().filter(p->p.getName().equals(USER_WRITE.name())).toList().get(0);
        var p2= permissionsSet.stream().filter(p->p.getName().equals(HOLIDAYPLAN_READ.name())).toList().get(0);
         var deletedPermission_1 =repository.deletePermissionFromRole(roleList[0].getId(),p1.getId());
        var deletedPermission_2 =repository.deletePermissionFromRole(roleList[1].getId(),p2.getId());
        Assertions.assertEquals(1,deletedPermission_1);
        Assertions.assertEquals(1,deletedPermission_2);

    }
    @Test
    void deletePermissionFromRoleWithInValidPermissions() {
        var p1= permissionsSet.stream().filter(p->p.getName().equals(USER_WRITE.name())).toList().get(0);
        var p2= permissionsSet.stream().filter(p->p.getName().equals(HOLIDAYPLAN_READ.name())).toList().get(0);
        var deletedPermission_1 =repository.deletePermissionFromRole(-100,p1.getId());
        var deletedPermission_2 =repository.deletePermissionFromRole(700,p2.getId());
        var deletedPermission_3 =repository.deletePermissionFromRole(roleList[0].getId(),1000);
        var deletedPermission_4 =repository.deletePermissionFromRole(roleList[1].getId(),-2);
        Assertions.assertEquals(0,deletedPermission_1);
        Assertions.assertEquals(0,deletedPermission_2);
        Assertions.assertEquals(0,deletedPermission_3);
        Assertions.assertEquals(0,deletedPermission_4);

=======
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
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
    }
}