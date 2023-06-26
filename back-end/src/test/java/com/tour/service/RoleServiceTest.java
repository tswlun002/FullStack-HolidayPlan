package com.tour.service;

import com.tour.dto.RoleEvent;
import com.tour.exception.DuplicateException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.Permission;
import com.tour.model.Role;
import com.tour.repository.RolesRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.env.Environment;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {
   @Mock
   private RolesRepository rolesRepository;
   @Mock
   private OnPermission permissionObj;
   @Mock
   private ApplicationEventPublisher publisher;
   @InjectMocks
   private  RoleService service;
    @Mock
    private Environment environment;
    @BeforeEach
    void setUp() {
        service = new RoleService(rolesRepository,publisher,permissionObj,environment);
    }

    @Test
    void testSaveDefaultRole(){

        var role ="SENIOR_SOFTWARE_DEVELOPER";
        when(environment.getProperty("role.default.names")).thenReturn(role);
        when(permissionObj.getNamesDefaultedPermission()).thenReturn(new String[]{"READ"});
        when(permissionObj.getPermission(anyString())).thenReturn(Permission.builder().name("READ").build());
        service.saveDefaultRole();
        verify(environment,times(1)).getProperty("role.default.names");
    }

    @ParameterizedTest
    @ValueSource(strings = {"USER","ADMIN","IT"})
    void saveRoleByCorrectName(String name) {
         var role = Role.builder().name(name).build();
         when(rolesRepository.getRole(name)).thenReturn(null);
         service.saveRole(role);
         verify(rolesRepository, atMostOnce()).getRole(name);
         verify(rolesRepository, atMostOnce()).save(role);
    }

    @ParameterizedTest
    @ValueSource(strings = {"USER","ADMIN","IT"})
    void saveRoleWhenThereDuplicate(String name) {
        var role = Role.builder().name(name).build();
        when(rolesRepository.getRole(name)).thenReturn(role);
        var actual = assertThrows(DuplicateException.class,()->service.saveRole(role));
        verify(rolesRepository, atMostOnce()).getRole(name);
        verify(rolesRepository, never()).save(role);
        assertEquals("Role already exists",actual.getMessage());

    }
    @Test
    void saveRoleWhenThereNull() {
        var actual = assertThrows(NullException.class,()->service.saveRole(null));
        verify(rolesRepository, never()).getRole(anyString());
        verify(rolesRepository, never()).save(any());
        assertEquals("Role is invalid",actual.getMessage());
    }

    @ParameterizedTest
    @ValueSource(strings = {"T","Z","D"})
    void saveInvalidPermissionNames(String name) {
        var role = Role.builder().name(name).build();
        Set<ConstraintViolation<Role>> violations = Validation.buildDefaultValidatorFactory().
                getValidator().validate(role);
        doThrow(new ConstraintViolationException(
                new HashSet<ConstraintViolation<?>>(violations))).when(rolesRepository).save(role);
        try{
            service.saveRole(role);
        }catch (ConstraintViolationException e){
            var actual = e.getConstraintViolations().stream().map(ConstraintViolation::getMessageTemplate).toList().get(0);
            assertEquals("Role name must be 3 letters minimum",actual);

        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","ADMIN_READ","USER_READ"})
    void addNewPermissionToRole(String name) {
        var role  = Role.builder().name("ADMIN").build();
        var permission  = Permission.builder().name(name).build();
        when(rolesRepository.getRole(role.getName())).thenReturn(role);
        when(permissionObj.getPermission(name)).thenReturn(permission);
        var actual  = service.addNewPermissionToRole(role.getName(),name);
        verify(rolesRepository,atMostOnce()).save(role);
        assertTrue(actual);
    }
    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","ADMIN_READ","USER_READ"})
    void addNewPermissionToRoleDoesNotExists(String name) {
        when(rolesRepository.getRole("ADMIN")).thenReturn(null);
        var actual = assertThrows(NotFoundException.class,()->service.addNewPermissionToRole("ADMIN",name));
        verify(rolesRepository, atMostOnce()).getRole("ADMIN");
        verify(permissionObj, never()).getPermission(name);
        verify(rolesRepository,never()).save(any());
        assertEquals("Role is not found",actual.getMessage());
    }
    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","ADMIN_READ","USER_READ"})
    void addNewPermissionDoesNotExistsToRole(String name) {
        var role  = Role.builder().name("ADMIN").build();
        when(rolesRepository.getRole("ADMIN")).thenReturn(role);
        when(permissionObj.getPermission(name)).thenReturn(null);
        var actual = assertThrows(NotFoundException.class,()->service.addNewPermissionToRole("ADMIN",name));
        verify(rolesRepository, atMostOnce()).getRole("ADMIN");
        verify(permissionObj, atMostOnce()).getPermission(name);
        verify(rolesRepository,never()).save(any());
        assertEquals("Permission is not found",actual.getMessage());
    }
   @Test
    void TryDeleteNullPermissionFromRoles() {
       var actual = assertThrows(NullException.class,()->service.deletePermissionFromRoles(null));
       verify(rolesRepository,never()).getRolesByPermission(anyString());
       verify(rolesRepository, never()).deletePermissionFromRole(anyLong(),anyLong());
       verify(rolesRepository, never()).save(any());
       assertEquals("Permission is invalid",actual.getMessage());
   }
    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","ADMIN_READ","USER_READ"})
    void deletePermissionFromRoles(String permissionName) {
        var permission  = Permission.builder().id(1L).name(permissionName).build();

        var roles  = Set.of(Role.builder().id(1L).name("USER").permissions(Set.of(permission)).build(),
                Role.builder().permissions(Set.of(permission)).id(2L).name("ADMIN").build());
        when(rolesRepository.getRolesByPermission(permissionName)).thenReturn(roles.stream().toList());
        when(rolesRepository.deletePermissionFromRole(anyLong(),anyLong())).thenReturn(1);
       service.deletePermissionFromRoles(permission);
       verify(rolesRepository, atMostOnce()).getRolesByPermission(permissionName);
       verify(rolesRepository, times(2)).deletePermissionFromRole(anyLong(),anyLong());
       verify(rolesRepository, times(2)).save(any());

    }
    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","ADMIN_READ","USER_READ"})
    void deleteValidPermissionFromValidRole(String permissionName) {
        var permission  = Permission.builder().id(1L).name(permissionName).build();

        var role  =Role.builder().id(1L).name("USER").permissions(Set.of(permission)).build();
        when(rolesRepository.getRole(role.getName())).thenReturn(role);
        when(rolesRepository.deletePermissionFromRole(anyLong(),anyLong())).thenReturn(1);
        var actual = service.deletePermissionFromRole(role.getName(),permissionName);
        verify(rolesRepository, atMostOnce()).getRolesByPermission(permissionName);
        verify(rolesRepository, times(1)).deletePermissionFromRole(anyLong(),anyLong());
        verify(rolesRepository, times(1)).save(any());
        assertTrue(actual);
    }

    @ParameterizedTest
    @ValueSource(strings = {"USER","ADMIN","IT"})
    void deleteValidRoleThatHasPermissions(String roleName){
        var role  = Role.builder().id(1L).name(roleName).
                permissions(Set.of(Permission.builder().id(1L).name("USER_READ").build(),
                        Permission.builder().id(2L).name("QUERY_READ").build(),
                        Permission.builder().id(3L).name("USER_WRITE").build())).build();
        when(rolesRepository.getRole(roleName)).thenReturn(role);
        when(rolesRepository.deletePermissionFromRole(anyLong(),anyLong())).thenReturn(1);
        var actual = service.deleteRole(roleName);
        verify(rolesRepository, atMostOnce()).getRole(roleName);
        verify(publisher,atMostOnce()).publishEvent(new RoleEvent(role));
        verify(rolesRepository,times(3)).deletePermissionFromRole(anyLong(),anyLong());
        verify(rolesRepository, times(1)).delete(role);
        assertTrue(actual);

    }
    @ParameterizedTest
    @ValueSource(strings = {"USER","ADMIN","IT"})
    void deleteValidRoleThatHasNoPermissions(String roleName){
        var role  = Role.builder().id(1L).name(roleName).build();
        when(rolesRepository.getRole(roleName)).thenReturn(role);
        var actual = service.deleteRole(roleName);
        verify(rolesRepository, atMostOnce()).getRole(roleName);
        verify(publisher,atMostOnce()).publishEvent(new RoleEvent(role));
        verify(rolesRepository,times(0)).deletePermissionFromRole(anyLong(),anyLong());
        verify(rolesRepository, times(1)).delete(role);
        assertTrue(actual);

    }
    @ParameterizedTest
    @ValueSource(strings = {"USER","ADMIN","IT"})
    void deleteValidRoleFailToDeleteForeignKeys(String roleName){
        var role  = Role.builder().id(1L).name(roleName).
                permissions(Set.of(Permission.builder().id(1L).name("USER_READ").build(),
                        Permission.builder().id(2L).name("QUERY_READ").build(),
                        Permission.builder().id(3L).name("USER_WRITE").build())).build();
        when(rolesRepository.getRole(roleName)).thenReturn(role);
        when(rolesRepository.deletePermissionFromRole(anyLong(),anyLong())).thenReturn(0);
        var actual = service.deleteRole(roleName);
        verify(rolesRepository, atMostOnce()).getRole(roleName);
        verify(publisher,atMostOnce()).publishEvent(new RoleEvent(role));
        verify(rolesRepository,times(3)).deletePermissionFromRole(anyLong(),anyLong());
        verify(rolesRepository, times(0)).delete(role);
        assertFalse(actual);
    }



    @Test
    void getRoles() {
        var roles=Set.of(Role.builder().name("USER").build(),
                Role.builder().name("IT").build());
        when(rolesRepository.findAllRoles()).thenReturn(roles);
        var actual  = service.getRoles();
        verify(rolesRepository, atMostOnce()).getRoles();
        assertArrayEquals(roles.toArray(),actual.toArray());
    }


    @Test
    void deleteRole() {
    }
}