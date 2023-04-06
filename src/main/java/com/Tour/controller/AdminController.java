package com.Tour.controller;

import com.Tour.exception.CatchException;
import com.Tour.exception.InvalidCredentials;
import com.Tour.exception.NotFoundException;
import com.Tour.model.User;
import com.Tour.model.UserRole;
import com.Tour.model.UserType;
import com.Tour.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@CrossOrigin( origins = "*")
@RequestMapping("/holiday-plan/api/admin/")
public class AdminController {

    @Autowired
    private UserService userService;
    @PostMapping(value="user/save/",consumes = {"application/json"})
    public ResponseEntity<Boolean> saveAdmin(@RequestBody @Validated RegisterUserRequest request){
        boolean saved =false;
        var type = getType(request.usertype());
        try {
            var user  = User.builder().firstname(request.firstname()).lastname(request.lastname())
                    .age(request.age()).username(request.username()).password(request.password())
                    .userType(type).roles(new HashSet<>()).build();

            saved= userService.saveUser(user) ;
        }
        catch (Exception e){
            CatchException.catchException(e);
        }
        return saved?
                new ResponseEntity<>(true, HttpStatus.OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }


    @GetMapping(path="users/")
    public ResponseEntity<Set<User>> getAllUsers(){
        var users = userService.getUsers();

        if(users.size()==0)throw new NotFoundException("User(s) is not found");
        return  new ResponseEntity<>(users,HttpStatus.OK);
    }


    @GetMapping(path = "user-details/")
    public ResponseEntity<User> getMyDetails()  {

        User user =  userService.getLoginedUser();
        System.out.println(user);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
    @GetMapping(path = "user-name/{userName}")
    public ResponseEntity<User> get(@PathVariable("userName") String userName) throws NotFoundException {
        User user =  userService.getUser(userName);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
    @PatchMapping(value = "add/role/")
    public ResponseEntity<Boolean> addNewRoleToUser(
            @RequestParam UserRole userRole, @RequestParam  String userName){
        return  userService.addNewRoleToUser(userRole,userName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
    private  UserRole getRole(String userRole){
        UserRole role ;
        try{
            role = UserRole.valueOf(userRole.trim().toUpperCase());
        }catch (IllegalArgumentException e){
            throw  new InvalidCredentials("Invalid user role "+e.getMessage().substring(e.getMessage().lastIndexOf(".")+1)
                    .toLowerCase());
        }
        return role;
    }
    private  UserType getType(String userType){
        UserType type ;
        try{
            type = UserType.valueOf(userType.trim().toUpperCase());
        }catch (IllegalArgumentException e){
            throw  new InvalidCredentials("Invalid user role "+e.getMessage().substring(e.getMessage().lastIndexOf(".")+1)
                    .toLowerCase());
        }
        return type;
    }
    @DeleteMapping(value = "/delete-role-from-user/")
    public ResponseEntity<Boolean>   deleteRoleFromUser(@RequestParam String userName, @RequestParam String userRole){
       var role = getRole(userRole);
        return  userService.deleteRoleFromUser(userName,role)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @DeleteMapping("delete-user/{userName}" )
    public  ResponseEntity<Boolean> delete(@PathVariable String userName){
        boolean deleted= userService.deleteUser(userName);
        if(deleted)return  new ResponseEntity<>(true, HttpStatus.OK);
        return new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }
}
