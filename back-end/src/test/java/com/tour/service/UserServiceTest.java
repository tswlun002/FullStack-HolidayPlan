package com.tour.service;
import com.tour.dto.UserEvent;
import com.tour.exception.AppInternalException;
import com.tour.exception.DuplicateException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.Permission;
import com.tour.model.Role;
import com.tour.model.User;
import com.tour.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.env.Environment;
import java.sql.Date;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;
import static com.tour.utils.Permissions.*;
import static com.tour.utils.Roles.ADMIN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
     @Mock
     private UserRepository repository;
     @Mock private  OnRole roleObj;
     @Mock private  OnPermission permissionObj;
     @Mock private ApplicationEventPublisher publisher;
     @InjectMocks UserService service;
     @Mock
     private Environment environment;

    @BeforeEach
    void setUp() {
        service = new UserService(repository,publisher,roleObj,permissionObj,environment);
    }

    @Test
    void saveDefaultUser(){
        var stringUser = "{\"firstname\":\"manager\", \"lastname\":\"manager\"," +
                "\"username\":\"tour_01@tour.com\",\"password\":\"123456\",\"age\":\"2023-02-16\"," +
                "\"usertype\":\"SENIOR_SOFTWARE_DEVELOPER\"}";
        var role = Role.builder().name("SENIOR_SOFTWARE_DEVELOPER").build();
        when(environment.getProperty("user.default.user")).thenReturn(stringUser);
        when(roleObj.getRole(role.getName())).thenReturn(role);
        service.saveDefaultUser();
        verify(environment, times(1)).getProperty("user.default.user");
        verify(roleObj,times(1)).getRole(role.getName());
    }
    @Test
    void saveUser() {
        var ROLE_NAME ="SENIOR_SOFTWARE_DEVELOPER";
        var PERMISSION_NAMES = "SOFTWARE_READ,SOFTWARE_WRITE".split(",");
        var permissions = Arrays.stream(PERMISSION_NAMES).map(name->Permission.builder().name(name).build())
                .collect(Collectors.toSet());
        var role  = Role.builder().permissions(permissions).name(ROLE_NAME).build();

        var user  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();

        when(repository.getUser(user.getUsername())).thenReturn(null);

        when(roleObj.getRole(anyString())).thenReturn(role);

        var actual =service.saveUser(user);
        verify(repository,times(1)).getUser(user.getUsername());
        verify(repository, times(1)).save(user);
        var roles = user.getRoles();
        var permissions_out  = ((Role)roles.toArray()[0]).
                getPermissions().stream().sorted(Comparator.comparing(Permission::getName)).toList();
        assertTrue(actual);
        assertThat(roles.size()).isEqualTo(1);
        assertThat(permissions_out.size()).isEqualTo(permissions.size());

    }
    @Test
    void saveNullUser(){
        var actual =assertThrows(NullException.class,()->service.saveUser(null));
        assertEquals("User is invalid",actual.getMessage());
        verify(repository, times(0)).getUser(anyString());
        verify(repository, times(0)).save(any());
    }
    @Test
    void saveDuplicateUser(){
        var user  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        when(repository.getUser("tsewu_1@gmail.com")).thenReturn(user);
        var actual =assertThrows(DuplicateException.class,()->service.saveUser(user));
        assertEquals("User exists with username",actual.getMessage());
        verify(repository, times(1)).getUser(anyString());
        verify(repository, times(0)).save(any());
    }
    @Test
    void getUser() {
        var user  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        when(repository.getUser("tsewu_1@gmail.com")).thenReturn(user);
        var actual = service.getUser(user.getUsername());
        verify(repository, times(1)).getUser(user.getUsername());
        assertThat(actual).isEqualTo(user);
    }

    @Test
    void getUsers() {
        var user1  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var user2  = User.builder().username("tsewu_10@gmail.com").
                firstname("Wanga").lastname("Tsewu").age(Date.valueOf("1997-02-09"))
                .password("123454").build();

        when(repository.findAllUser()).thenReturn(Set.of(user1,user2));
        var actual = service.getUsers();
        verify(repository, times(1)).findAllUser();
        assertThat(actual).isEqualTo(Set.of(user1, user2));
    }
    @Test
    void  addNewValidRoleToUser(){
        var user1  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var role  = Role.builder().name("USER").build();
        when(repository.getUser(user1.getUsername())).thenReturn(user1);
        when(roleObj.getRole(role.getName())).thenReturn(role);
        when(repository.save(user1)).thenReturn(user1);
        var actual  = service.addNewRoleToUser(user1.getUsername(),role.getName());
        verify(repository, times(1)).getUser(user1.getUsername());
        verify(repository, times(1)).save(user1);
        assertThat(actual).isEqualTo(true);

    }
    @Test
    void  addNewRoleDoesNotExistToUser(){
        var user1  = User.builder().username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var role  = Role.builder().name("USER").build();
        when(repository.getUser(user1.getUsername())).thenReturn(user1);
        when(roleObj.getRole(role.getName())).thenReturn(null);
        var actual  = assertThrows(NotFoundException.class,
                ()->service.addNewRoleToUser(user1.getUsername(),role.getName()));
        verify(repository, times(1)).getUser(user1.getUsername());
        verify(repository, times(0)).save(user1);
        assertThat(actual).isExactlyInstanceOf(NotFoundException.class);
        assertThat(actual.getMessage()).isEqualTo("Role is not found");
    }
    @Test
    void  addNewRoleToUserDoesNotExists(){
        when(repository.getUser("tswlun002@gmail.com")).thenReturn(null);
        var actual  = assertThrows(NotFoundException.class,
                ()->service.addNewRoleToUser("tswlun002@gmail.com",anyString()));
        verify(repository, times(1)).getUser("tswlun002@gmail.com");
        verify(roleObj,never()).getRole(anyString());
        verify(repository,never()).save(any());
        assertThat(actual).isExactlyInstanceOf(NotFoundException.class);
        assertThat(actual.getMessage()).isEqualTo("User is not found");
    }
    @Test
    void deleteRoleFromNullUser(){
        var actual  = assertThrows(NullException.class,()->service.deleteRoleFromUser(null));
        verify(repository, never()).getUsersByRole(anyString());
        verify(repository, never()).deleteRoleFromUser(anyLong(),anyLong());
        assertThat(actual).isExactlyInstanceOf(NullException.class);
        assertThat(actual.getMessage()).isEqualTo("Role is invalid");
    }
    @Test
    void deleteRoleFromValidUser(){
         var role  = Role.builder().id(1L).name("ADMIN").build();
        var user1  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        user1.getRoles().add(role);
        var user2  = User.builder().id(2L).username("tsewu_10@gmail.com").
                firstname("Wanga").lastname("Tsewu").age(Date.valueOf("1997-02-09"))
                .password("123454").build();
        user2.getRoles().add(role);

        var users  = Set.of(user1, user2);
         when(repository.getUsersByRole(role.getName())).thenReturn(users.stream().toList());
        when(repository.deleteRoleFromUser(anyLong(), anyLong())).thenReturn(1);
        when(repository.save(user1)).thenReturn(user1);
        when(repository.save(user2)).thenReturn(user2);
         service.deleteRoleFromUser(role);
        verify(repository, times(1)).getUsersByRole(anyString());
        verify(repository, times(2)).deleteRoleFromUser(anyLong(),anyLong());
        ArgumentCaptor<User> argument = ArgumentCaptor.forClass(User.class);
        verify(repository,times(2)).save(argument.capture());
        var actual  = argument.getAllValues().stream().sorted(Comparator.comparing(User::getFirstname)).toList();
        assertThat(argument.getAllValues().size()).isEqualTo(2);
        assertThat(actual.get(0)).isEqualTo(user1);
        assertThat(actual.get(1)).isEqualTo(user2);
    }
    @Test
    void deleteRoleFromUserByUsernameAndRoleName(){
        var role  = Role.builder().id(1L).name("ADMIN").build();
        var user1  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        user1.getRoles().add(role);
        when(repository.getUser(user1.getUsername())).thenReturn(user1);
        when(repository.deleteRoleFromUser(user1.getId(), role.getId())).thenReturn(1);
        when(repository.save(user1)).thenReturn(user1);
        var actual  = service.deleteRoleFromUser(user1.getUsername(), role.getName());
        verify(repository, times(1)).getUser(user1.getUsername());
        verify(repository, times(1)).deleteRoleFromUser(user1.getId(),role.getId());
        assertThat(actual).isEqualTo(true);

    }
    @Test
    void addValidPermissionToValidUser(){
        var user1  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var permission  = Permission.builder().id(1L).name(USER_WRITE.name()).build();
        when(repository.getUser(user1.getUsername())).thenReturn(user1);
        when(permissionObj.getPermission(permission.getName())).thenReturn(permission);
        when(repository.save(user1)).thenReturn(user1);
        var actual  = service.addPermissionToUser(user1.getUsername(), permission.getName());
        verify(repository, times(1)).getUser(user1.getUsername());
        verify(permissionObj, times(1)).getPermission(permission.getName());
        verify(repository, times(1)).save(user1);
        assertThat(actual).isEqualTo(true);
    }

    @Test
    void addValidPermissionToInValidUser(){
        when(repository.getUser(anyString())).thenReturn(null);
        var actual  = assertThrows(NotFoundException.class, ()->service.addPermissionToUser("tsewu@gmail.com", USER_READ.name()));
        verify(repository, times(1)).getUser(anyString());
        verify(permissionObj, times(0)).getPermission(anyString());
        verify(repository, times(0)).save(any());
        assertThat(actual).isExactlyInstanceOf(NotFoundException.class);
        assertThat(actual.getMessage()).isEqualTo("User is not found");
    }
    @Test
    void addInValidPermissionToValidUser(){
        var user  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        when(repository.getUser(user.getUsername())).thenReturn(user);
        when(permissionObj.getPermission(anyString())).thenReturn(null);
        var actual  = assertThrows(NotFoundException.class, ()->service.addPermissionToUser(user.getUsername(), USER_READ.name()));
        verify(repository, times(1)).getUser(anyString());
        verify(permissionObj, times(1)).getPermission(anyString());
        verify(repository, times(0)).save(any());
        assertThat(actual).isExactlyInstanceOf(NotFoundException.class);
        assertThat(actual.getMessage()).isEqualTo("Permission is not found");
    }
    @Test
    void deleteValidPermissionFromValidUser(){
        var permission  = Permission.builder().id(1L).name(QUERY_READ.name()).build();
        var user1  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        user1.getPermissions().add(permission);
        var user2  = User.builder().id(2L).username("tsewu_10@gmail.com").
                firstname("Wanga").lastname("Tsewu").age(Date.valueOf("1997-02-09"))
                .password("123454").build();
        user2.getPermissions().add(permission);
        var users  = Set.of(user1, user2);
        when(repository.getUsersByPermission(permission.getName())).thenReturn(users.stream().toList());
        when(repository.deletePermissionFromUser(anyLong(), anyLong())).thenReturn(1);
        when(repository.save(user1)).thenReturn(user1);
        when(repository.save(user2)).thenReturn(user2);
        service.deletePermissionFromUser(permission);
        verify(repository, times(1)).getUsersByPermission(anyString());
        verify(repository, times(2)).deletePermissionFromUser(anyLong(),anyLong());
        ArgumentCaptor<User> argument = ArgumentCaptor.forClass(User.class);
        verify(repository,times(2)).save(argument.capture());
        var actual  = argument.getAllValues().stream().sorted(Comparator.comparing(User::getFirstname)).toList();
        assertThat(argument.getAllValues().size()).isEqualTo(2);
        assertThat(actual.get(0)).isEqualTo(user1);
        assertThat(actual.get(1)).isEqualTo(user2);

    }
    @Test
    void deleteValidPermissionFromValidUserButFailedToDeleted(){
        var permission  = Permission.builder().id(1L).name(QUERY_READ.name()).build();
        var user1  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        user1.getPermissions().add(permission);
        var user2  = User.builder().id(2L).username("tsewu_10@gmail.com").
                firstname("Wanga").lastname("Tsewu").age(Date.valueOf("1997-02-09"))
                .password("123454").build();
        user2.getPermissions().add(permission);
        var users  = Set.of(user1, user2);
        when(repository.getUsersByPermission(permission.getName())).thenReturn(users.stream().toList());
        when(repository.deletePermissionFromUser(anyLong(), anyLong())).thenReturn(0);
        var actual = assertThrows(AppInternalException.class,()->service.deletePermissionFromUser(permission));
        verify(repository, times(1)).getUsersByPermission(anyString());
        verify(repository, times(1)).deletePermissionFromUser(anyLong(),anyLong());
        verify(repository,times(0)).save(any());
        assertThat(actual).isExactlyInstanceOf(AppInternalException.class);
        assertThat(actual.getMessage().substring(actual.getMessage().indexOf(":")+1).trim()).isEqualTo("Failed to delete permission");
    }
    @Test
    void deletePermissionFromUserByUsernameAndRoleName(){
        var permission  = Permission.builder().id(1L).name(QUERY_WRITE.name()).build();
        var user1  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        user1.getPermissions().add(permission);
        when(repository.getUser(user1.getUsername())).thenReturn(user1);
        when(repository.deletePermissionFromUser( permission.getId(),user1.getId())).thenReturn(1);
        when(repository.save(user1)).thenReturn(user1);
        var actual  = service.deletePermissionFromUser(user1.getUsername(), permission.getName());
        verify(repository, times(1)).getUser(user1.getUsername());
        verify(repository, times(1)).deletePermissionFromUser(permission.getId(),user1.getId());
        assertThat(actual).isEqualTo(true);

    }
    @Test
    void deleteUser(){
        var user  = User.builder().id(1L).username("tsewu_1@gmail.com").
                firstname("Lunga").lastname("Tsewu").age(Date.valueOf("1998-02-09"))
                .password("123456").build();
        var permission  = Permission.builder().id(1L).name(QUERY_WRITE.name()).build();
        var role  = Role.builder().id(1L).name(ADMIN.name()).build();
        user.getPermissions().add(permission);
        user.getRoles().add(role);
        when(repository.getUser(user.getUsername())).thenReturn(user);
        var actual  = service.deleteUser(user.getUsername());
        verify(publisher, times(1)).publishEvent(new UserEvent(user));
        assertThat(actual).isEqualTo(true);
    }

}