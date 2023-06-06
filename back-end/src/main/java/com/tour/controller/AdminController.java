package com.tour.controller;

import com.tour.dto.RegisterUserRequest;
import com.tour.exception.CatchException;
import com.tour.exception.NotFoundException;
import com.tour.model.User;
import com.tour.dto.UserResponseToAdmin;
import com.tour.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin( origins = "*")
@RequestMapping("/holiday-plan/api/admin/")
@AllArgsConstructor
public class AdminController {

    private final UserService userService;
    @PostMapping(value="user/save/",consumes = {"application/json"})
    public ResponseEntity<Boolean> saveAdmin(@RequestBody @Validated @NonNull RegisterUserRequest request){

            var user  = User.builder().firstname(request.firstname()).lastname(request.lastname())
                    .age(request.age()).username(request.username()).password(request.password())
                   .roles(new HashSet<>()).build();
        var    saved= userService.saveUser(user) ;
        return saved?
                new ResponseEntity<>(true, HttpStatus.OK) :
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
    @GetMapping(path="users/")
    public ResponseEntity<Set<UserResponseToAdmin>> getAllUsersByAdmin(){
        System.out.println("Username: "+userService.getLoginedUser());
        var users = userService.getUsers()
                .stream().map(user-> UserResponseToAdmin.builder().age(user.getAge())
                        .username(user.getUsername()).lastname(user.getLastname())
                        .firstname(user.getFirstname()).roles(user.getRoles()).permissions(user.getPermissions()).build())
                .collect(Collectors.toSet());
        if(users.size()==0)throw new NotFoundException("User(s) is not found");
        return  new ResponseEntity<>(users,HttpStatus.OK);
    }


    @GetMapping(path = "user/details/")
    public ResponseEntity<User> getMyDetails()  {

        User user =  userService.getLoginedUser();
        System.out.println(user);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
    @GetMapping(path = "username/{userName}")
    public ResponseEntity<User> get(@PathVariable("userName") String userName) throws NotFoundException {
        User user =  userService.getUser(userName);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
    @PatchMapping(value = "add/role/")
    public ResponseEntity<Boolean> addNewRoleToUser(
            @RequestParam String roleName, @RequestParam  String username){
        return  userService.addNewRoleToUser(username, roleName)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }

    @DeleteMapping(value = "/delete/user/")
    public ResponseEntity<Boolean>   deleteRoleFromUser(@RequestParam String userName, @RequestParam String userRole){

        return  userService.deleteRoleFromUser(userName,userRole)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @DeleteMapping("delete/user/{userName}" )
    public  ResponseEntity<Boolean> delete(@PathVariable String userName){
        boolean deleted= userService.deleteUser(userName);
        if(deleted)return  new ResponseEntity<>(true, HttpStatus.OK);
        return new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }
}
