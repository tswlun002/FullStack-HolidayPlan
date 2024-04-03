package com.tour.controller;
import com.tour.dto.UserResponseToAdmin;
import com.tour.exception.NotFoundException;
import com.tour.model.User;
import com.tour.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/holiday-plan/api/admin/user/")
@AllArgsConstructor
public class AdminController {

    private final UserService userService;
    @GetMapping(path="users/")
    public ResponseEntity<Set<UserResponseToAdmin>> getAllUsersByAdmin(){
        var users = userService.getUsers()
                .stream().map(user-> UserResponseToAdmin.builder().age(user.getAge())
                        .username(user.getUsername()).lastname(user.getLastname())
                        .firstname(user.getFirstname()).roles(user.getRoles()).
                        permissions(user.getPermissions()).build())
                .collect(Collectors.toSet());
        if(users.isEmpty())throw new NotFoundException("User(s) is not found");
        return  new ResponseEntity<>(users,HttpStatus.OK);
    }


    @GetMapping(path = "details/")
    public ResponseEntity<User> getMyDetails()  {

        User user =  userService.getLoginedUser();
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
    @GetMapping(path = "{userName}")
    public ResponseEntity<User> get(@PathVariable("userName") String userName) throws NotFoundException {
        User user =  userService.getUser(userName);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
      @PatchMapping(value = "add/role/")
    public ResponseEntity<Boolean> addRoleToUser( @RequestParam  String username, @RequestParam String roleName){
        return  userService.addNewRoleToUser(username,roleName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }

    @DeleteMapping(value = "delete/role/")
    public ResponseEntity<Boolean>   deleteRoleFromUser(@RequestParam String username, @RequestParam String roleName){
        return  userService.deleteRoleFromUser(username,roleName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @PatchMapping(value = "add/permission/")
    public ResponseEntity<Boolean> addPermissionToUser( @RequestParam  String username, @RequestParam String permissionName){
        return  userService.addPermissionToUser(username,permissionName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }

    @DeleteMapping(value = "delete/permission/")
    public ResponseEntity<Boolean>   deletePermissionFromUser(@RequestParam String username, @RequestParam String permissionName){
        return  userService.deletePermissionFromUser(username,permissionName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }

    @DeleteMapping("delete/" )
    public  ResponseEntity<Boolean> delete(@RequestParam String username){

        boolean deleted= userService.deleteUser(username);
        if(deleted)return  new ResponseEntity<>(true, HttpStatus.OK);
        return new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
}
