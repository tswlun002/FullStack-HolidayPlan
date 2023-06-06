package com.tour.repository;

import com.tour.model.Permission;
import com.tour.model.Role;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import static com.tour.utils.Roles.ADMIN;
import static com.tour.utils.Roles.USER;
import static com.tour.utils.Permissions.*;


@DataJpaTest
class RolesRepositoryTest {
    @Autowired
    private RolesRepository repository;
    @Autowired
    private PermissionRepository permissionRe;
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
    }

    @ParameterizedTest
    @CsvSource(delimiter = ':',value = {"0:USER" ,"1:ADMIN"})
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
    }

    @ParameterizedTest
    @CsvSource(value = {"1","2"})
    void findByIdWithCorrectId(int index) {
        var role_  = index==0? role_user : role2_admin;
        Assertions.assertEquals(role_,repository.getRole(role_.getId()));
    }
    @ParameterizedTest
    @CsvSource(value = {"-99","-500","-4","0"})
    void findByIdWithIncorrectId(int id) {
        Assertions.assertNull(repository.getRole(id));
    }
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
    }

    @Test
    void deletePermissionFromRoleWithValidPermissions() {
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

    }
}