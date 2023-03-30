package com.Tour.controller;

import com.Tour.exception.ApplicationExceptionHandler;
import com.Tour.exception.NotFoundException;
import com.Tour.model.Role;
import com.Tour.model.UserPermission;
import com.Tour.model.UserRole;

import com.Tour.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/holiday-plan/api/admin/role/")
public class RoleController  {
    @Autowired private RoleService service;
    @PostMapping(value = "save/")
    public void saveRole(@RequestBody  Role role) {
        service.saveRole(role);
    }
    @GetMapping(value = "roles/")
    public ResponseEntity<Set<Role>>getRoles() {
        var roles = service.getRoles();
        if(roles.size()==0)throw new NotFoundException("Role(s) is not found");
        return  new ResponseEntity<>(roles, HttpStatus.OK);
    }
    @GetMapping(value = "get/id/{id}")
    public Role getRole(@PathVariable("id") long id) {
        return service.getRole(id);
    }
    @GetMapping(value = "get/name/{userRole}")
    public Role getRole(@PathVariable String userRole) {
        return service.getRole(UserRole.valueOf(userRole.toUpperCase()));
    }
    @PatchMapping(value = "add/permission/role/")
    public ResponseEntity<Boolean> addNewPermissionToRole(@RequestParam UserRole userRole,
                                                 @RequestParam UserPermission userPermission) throws NotFoundException{
        boolean  added  = false;
        try{
            userPermission = UserPermission.valueOf(userPermission.name().toUpperCase());
            userRole = UserRole.valueOf(userRole.name().toUpperCase());

            service.addNewPermissionToRole(userRole,userPermission);
            added=true;
        }catch (Exception e){
            ApplicationExceptionHandler.builder().build();
        }
        if(added) return  new ResponseEntity<>(true, HttpStatus.OK);
        else return  new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);

    }
    @DeleteMapping(value = "delete/permission/role/")
    public ResponseEntity<Boolean>  deletePermissionFromRole(
            @RequestParam UserRole userRole,@RequestParam UserPermission userPermission){

            service.deletePermissionFromRole(userRole,userPermission);
            return  new ResponseEntity<>(true, HttpStatus.OK);
    }
    @DeleteMapping(value = "delete/")
    public ResponseEntity<Boolean>  deleteRole(@RequestParam("userRole") UserRole userRole) {
        return  service.deleteRole(userRole)
                ? new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
}
