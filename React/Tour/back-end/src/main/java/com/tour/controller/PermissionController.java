package com.tour.controller;

import com.tour.exception.NotFoundException;
import com.tour.model.Permission;
import com.tour.service.PermissionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/holiday-plan/api/admin/permission/")
@AllArgsConstructor
public class PermissionController  {
     private final PermissionService service;
    @PostMapping(value = "save/")
    public ResponseEntity<String> save(@RequestBody @Validated Permission permission) {
        service.save(permission);
        return  new ResponseEntity<>("Permission saved",HttpStatus.OK);
    }

    @GetMapping(value = "permissions/")
    public ResponseEntity<Set<Permission>> getPermissions() {
        var permissions= service.getPermissions();
        if(permissions.size()==0)throw  new NotFoundException("Permission(s) is not found");
        return new ResponseEntity<>(permissions,HttpStatus.OK);
    }

    @GetMapping(value = "get/name/{permissionName}")
    public ResponseEntity<Permission> getPermission(@PathVariable("permissionName") String permissionName) {
        Permission permission= service.getPermission(permissionName);
        if(permission==null)throw  new NotFoundException("Permission is not found");
        return new ResponseEntity<>(permission,HttpStatus.OK);
    }
    @GetMapping(value = "get/id/{id}")
    public ResponseEntity<Permission> getPermission(@PathVariable("id") long id) {
        Permission permission= service.getPermission(id);
        if(permission==null)throw  new NotFoundException("Permission is not found");
        return new ResponseEntity<>(permission,HttpStatus.OK);
    }

   @DeleteMapping(path = "delete/id/")
    public ResponseEntity<Boolean> deletePermission(@RequestParam long id) {
        boolean deleted = service.deletePermission(id);

       return deleted ?  new ResponseEntity<>(true,HttpStatus.OK)
              :new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);

    }
    @DeleteMapping(path = "delete/name/")
    public  ResponseEntity<Boolean>  deletePermission(@RequestParam String permissionName) {
        boolean deleted = service.deletePermission(permissionName);

        return deleted ?  new ResponseEntity<>(true,HttpStatus.OK)
                :new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
}
