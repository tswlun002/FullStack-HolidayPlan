package com.Tour.service;

import com.Tour.dto.PermissionEvent;
import com.Tour.exception.*;
import com.Tour.model.Permission;
import com.Tour.repository.PermissionRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PermissionServiceTest {
    @InjectMocks
    private PermissionService service;
    @Mock
    private PermissionRepository repository;
    @Mock
    private ApplicationEventPublisher publisher;
    @BeforeEach
    void setUp() {
        service =  new PermissionService(repository,publisher);
    }


    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","USER_READ", "QUERY_READ","HOLIDAY_READ"})
    void saveValidPermissions(String permissionName) {
        var permission = Permission.builder().name(permissionName).build();
        when(repository.findByName(permissionName)).thenReturn(null);
        service.save(permission);
        var value  =verify(repository,times(1)).findByName(permissionName);
        assertNull(value);
        verify(repository,times(1)).save(permission);
    }
    @Test
    void saveNullPermissions() {
        assertEquals("Permission is invalid", assertThrows(NullException.class,()->service.save(null)).getMessage());
        verify(repository,never()).findByName(anyString());
        verify(repository,never()).save(any());
    }

    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","USER_READ", "QUERY_READ","HOLIDAY_READ"})
    void saveDuplicatePermission(String permissionName) {
        var permission = Permission.builder().name(permissionName).build();
        when(repository.findByName(permissionName)).thenReturn(permission);
        assertEquals("Permission already exists", assertThrows(DuplicateException.class,()->service.save(permission)).getMessage());
        verify(repository,times(1)).findByName(permissionName);
        verify(repository,never()).save(permission);
    }
    @ParameterizedTest
    @ValueSource(strings = {"TO","ZO", "IT","DO"})
    void saveInvalidPermissionNames(String permissionName) {
        var permission = Permission.builder().name(permissionName).build();
        Set<ConstraintViolation<Permission>> violations = Validation.buildDefaultValidatorFactory().
                getValidator().validate(permission);

        doThrow(new ConstraintViolationException(
                new HashSet<ConstraintViolation<?>>(violations))).when(repository).save(permission);
        try{
            service.save(permission);

        }catch (ConstraintViolationException e){
            var actual = e.getConstraintViolations().stream().map(ConstraintViolation::getMessageTemplate).toList().get(0);
           assertEquals("Permission name must be 3 letters minimum",actual);

        }

    }
    @ParameterizedTest
    @CsvSource( delimiter=':',value = {"0:USER_WRITE","1:USER_READ", "2:QUERY_READ","3:HOLIDAY_READ"})
    void getPermissionByValidName(long id,String permissionName) {
        when(repository.findByName(permissionName)).thenReturn(Permission.builder().id(id).name(permissionName).build());
        var actual = repository.findByName(permissionName);
        verify(repository,atMostOnce()).findByName(permissionName);
        assertEquals(Permission.builder().id(id).name(permissionName).build().toString(),actual.toString());
    }
    @ParameterizedTest
    @ValueSource( strings = {"USER","READ", "QUERY","HOLIDAY"})
    void getPermissionByInValidName(String permissionName) {
        when(repository.findByName(permissionName)).thenReturn(null);
        var actual = repository.findByName(permissionName);
        verify(repository,atMostOnce()).findByName(permissionName);
        assertNull(actual);
    }



    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","USER_READ", "QUERY_READ","HOLIDAY_READ"})
    void testDeletePermissionByValidNames(String name) {
       var permission =Permission.builder().name(name).build();
        when(repository.findByName(name)).thenReturn(permission);
        var deleted= service.deletePermission(name);
        var value  =verify(repository,times(1)).findByName(name);
        verify(publisher,atMostOnce()).publishEvent(new PermissionEvent(permission));
        verify(repository,atMostOnce()).deletePermission(name);
        assertNotEquals(permission,value);
        assertTrue(deleted);
    }
    @ParameterizedTest
    @ValueSource(strings = {"USER_WRITE","USER_READ", "QUERY_READ","HOLIDAY_READ"})
    void testDeletePermissionByNamesThatDoNotExists(String name) {
        var permission =Permission.builder().name(name).build();
        when(repository.findByName(name)).thenReturn(null);
        var actual = assertThrows(NotFoundException.class,()->service.deletePermission(name)).getMessage();
        var value  =verify(repository,times(1)).findByName(name);
        verify(publisher,never()).publishEvent(new PermissionEvent(permission));
        verify(repository,never()).deletePermission(name);
        assertNull(value);
        assertEquals("Permission is not found",actual);
    }
    @ParameterizedTest
    @ValueSource(strings = {"TO","ZO", "IT","DO"})
    void deleteInvalidPermissionNames(String permissionName) {
        var permission = Permission.builder().name(permissionName).build();

        doThrow(new RuntimeException("Can not delete permission")).when(repository).save(permission);
        try{
            service.save(permission);

        }catch (AppInternalException e){
            var actual = e.getMessage();
            assertEquals("Can not delete permission",actual.substring(actual.lastIndexOf(":")+1).trim());

        }

    }
}