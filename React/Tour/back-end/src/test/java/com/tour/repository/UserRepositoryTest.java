package com.tour.repository;

import com.tour.model.Permission;
import com.tour.model.Role;
import com.tour.model.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.sql.Date;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import static com.tour.utils.Roles.ADMIN;
import static com.tour.utils.Roles.USER;
import static com.tour.utils.Permissions.USER_READ;
import static com.tour.utils.Permissions.USER_WRITE;


@DataJpaTest
class UserRepositoryTest {
    @Autowired
    UserRepository userRepository;
    @Autowired RolesRepository rolesRepository;
    @Autowired
     PermissionRepository permissionRe;
     private User user1;
    private User  user2;
    private User user3;
    Role role_user,role2_admin;
   Permission p1, p2;

    @BeforeEach
    void beforeEach(){
         role_user     = Role.builder().name(USER.name()).build();
         role2_admin   = Role.builder().name(ADMIN.name()).build();
         rolesRepository.save(role2_admin);
         rolesRepository.save(role_user);

         p1=Permission.builder().name(USER_WRITE.name()).build();
         p2= Permission.builder().name(USER_READ.name()).build();

         permissionRe.saveAll(List.of(p1,p2))  ;
         user1 = User.builder().age(new java.util.Date(Date.valueOf("1998-02-09").getTime())).firstname("Lunga")
               .lastname( "Tsewu").password("123456").username("lu01@mail.com").build();
         user1.setRoles(Set.of(role2_admin));
         user1.setPermissions(Set.of(p1));

        user2 =User.builder().age(new java.util.Date(Date.valueOf("1999-08-08").getTime())).firstname("Sakhe").
                lastname("Nombombo").password("123456").username("sakhe01@gmail.com").build();
        user2.setRoles(Set.of(role_user, role2_admin));
        user2.setPermissions(Set.of(p2));

        user3 =User.builder().age(new java.util.Date(Date.valueOf("2001-04-07").getTime())).firstname("Buhle").
                lastname("Buhle").password("123456").username("bu01@gmail.com").build();
        user3.setRoles(Set.of(role_user));

       userRepository.save(user1); userRepository.save(user2);userRepository.save(user3);

    }
    @AfterEach
    void tearDown() {
        rolesRepository.deleteAll();
        userRepository.deleteAll();
        user2=null; user3=null; user1=null;
        role_user=role2_admin=null;
        p1=p2=null;
    }

    @Test
    void getUserByExistingUserName() {
         List.of(user1, user2, user3).forEach(user->
                 {
                     var actual =userRepository.getUser(user.getUsername());
                     Assertions.assertEquals(user,actual);
                 }
         );
    }
    @Test
    void TryToGeUserByUserNameThatDoesNotExits() {

        List.of(user1, user2, user3).forEach(user->
                {
                    userRepository.delete(user);
                    var actual =userRepository.getUser(user.getUsername());
                    Assertions.assertNull(actual);
                }
        );
    }
    @Test
    void TryToGeUserByRoleNameThatDoesExits() {

        List.of(role_user, role2_admin).forEach(role->
                {
                    var actual =userRepository.getUsersByRole(role.getName());
                    actual =actual.stream().sorted(Comparator.comparing(User::getFirstname)).toList();
                    Assertions.assertArrayEquals(role.getName().equals(USER.name())?new User[]{user3,user2}:new User[]{user1,user2},actual.toArray());
                }
        );
    }
    @Test
    void TryToGeUserByRoleNameThatDoesNotExits() {

        user2.setRoles(null);
        user3.setRoles(null);

        List.of(role_user).forEach(role->
                {
                    var actual =userRepository.getUsersByRole(role.getName()).size();
                    Assertions.assertEquals(0, actual);
                }
        );
    }

    @Test
    void deleteRoleFromUserCorrectUseIdAndRoleId(){
        List.of(role_user, role2_admin).forEach(role->
                {
                    var actual =userRepository.deleteRoleFromUser(role.getId(),role.getName().equals(USER.name())?user2.getId():user1.getId());
                    Assertions.assertEquals(1,actual);
                }
        );
    }

    @Test
    void deleteRoleFromUserInCorrectUseIdAndRoleId(){
        List.of(role_user, role2_admin).forEach(role->
                {
                    var actual1 =userRepository.deleteRoleFromUser(0,role.getName().equals(USER.name())?user2.getId():user1.getId());
                    var actual2 =userRepository.deleteRoleFromUser(role.getId(),0);
                    var actual3 =userRepository.deleteRoleFromUser(-100,500);
                    Assertions.assertEquals(0,actual1+actual2+actual3);
                }
        );
    }

    @Test
    void TryToGeUserByPermissionNameThatDoesExits() {

        List.of(p1, p2).forEach(permission->
                {
                    var actual =userRepository.getUsersByPermission(permission.getName());
                    actual =actual.stream().sorted(Comparator.comparing(User::getFirstname)).toList();
                    Assertions.assertArrayEquals(permission.getName().equals(USER_WRITE.name())?new User[]{user1}:new User[]{user2},actual.toArray());
                }
        );
    }
    @Test
    void TryToGeUserByPermissionNameThatDoesNotExits() {

        user1.setPermissions(null);
        user2.setPermissions(null);
        List.of(p1).forEach(permission->
                {
                    //rolesRepository.delete(role);
                    var actual =userRepository.getUsersByPermission(permission.getName()).size();
                    Assertions.assertEquals(0, actual);
                }
        );
    }

    @Test
    void deletePermissionFromUserCorrectUseIdAndPermissionId(){
        List.of(p1, p2).forEach(permission->
                {
                    var actual =userRepository.deletePermissionFromUser(permission.getId(),permission.getName().equals(USER_WRITE.name())?user1.getId():user2.getId());
                    Assertions.assertEquals(1,actual);
                }
        );
    }

    @Test
    void deletePermissionFromUserInCorrectUseIdAndPermissionId(){
        List.of(p1, p2).forEach(permission->
                {
                    var actual1 =userRepository.deletePermissionFromUser(0,permission.getName().equals(USER_WRITE.name())?user1.getId():user2.getId());
                    var actual2 =userRepository.deletePermissionFromUser(permission.getId(),0);
                    var actual3 =userRepository.deletePermissionFromUser(-100,500);
                    Assertions.assertEquals(0,actual1+actual2+actual3);
                }
        );
    }


    @Test
    void findAllUserWhenThereUsersExists(){
        var actual  = userRepository.findAllUser().stream().toList();
        Assertions.assertNotNull(actual);
        Assertions.assertEquals(3, actual.size());
        actual =actual.stream().sorted(Comparator.comparing(User::getFirstname)).toList();;
        Assertions.assertArrayEquals(new User[]{user3, user1, user2}, actual.toArray());
    }
    @Test
    void findAllUserWhenThereNoUsersExists(){
        userRepository.deleteAll();
        var actual  = userRepository.findAllUser().stream().toList();
        Assertions.assertTrue(actual.isEmpty());
    }


}