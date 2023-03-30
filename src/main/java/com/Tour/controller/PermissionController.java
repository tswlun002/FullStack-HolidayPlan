package com.Tour.controller;

import com.Tour.exception.NotFoundException;
import com.Tour.model.Permission;
import com.Tour.model.UserPermission;

import com.Tour.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/holiday-plan/api/admin/permission/")

public class PermissionController  {
    @Autowired private PermissionService service;


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

    @GetMapping(value = "get/name/{userPermission}")
    public ResponseEntity<Permission> getPermission(@PathVariable("userPermission") UserPermission userPermission) {
        Permission permission= service.getPermission(userPermission);
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
    public  ResponseEntity<Boolean>  deletePermission(@RequestParam UserPermission userPermission) {
        boolean deleted = service.deletePermission(userPermission);

        return deleted ?  new ResponseEntity<>(true,HttpStatus.OK)
                :new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
}
