package com.tour.controller;

import com.tour.exception.NotFoundException;
import com.tour.model.Role;
import com.tour.service.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/holiday-plan/api/admin/role/")
@AllArgsConstructor
public class RoleController  {
    final private RoleService service;
    @PostMapping(value = "save/")
    public void saveRole(@RequestBody  @Validated Role role) {
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
    @GetMapping(value = "get/name/{roleName}")
    public Role getRole(@PathVariable String roleName) {
        return service.getRole(roleName);
    }
    @PatchMapping(value = "add/permission/role/")
    public ResponseEntity<Boolean> addNewPermissionToRole(@RequestParam String roleName,
                                                 @RequestParam String permissionName){
        var added= service.addNewPermissionToRole(roleName,permissionName);
        if(added) return  new ResponseEntity<>(true, HttpStatus.OK);
        else return  new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);

    }
    @DeleteMapping(value = "delete/permission/role/")
    public ResponseEntity<Boolean>  deletePermissionFromRole(
            @RequestParam String roleName, @RequestParam String permissionName){

            service.deletePermissionFromRole(roleName,permissionName);
            return  new ResponseEntity<>(true, HttpStatus.OK);
    }
    @DeleteMapping(value = "delete/")
    public ResponseEntity<Boolean>  deleteRole(@RequestParam("roleName") String roleName) {
        return  service.deleteRole(roleName)
                ? new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
}
