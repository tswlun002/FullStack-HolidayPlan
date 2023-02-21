package com.Tour.controller;

import com.Tour.exception.NotFoundException;
import com.Tour.model.User;
import com.Tour.service.CatchException;
import com.Tour.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/home/User")
public class TouristController {

    @Autowired
    UserService userService;

    @PostMapping(value="/save-user")
    public ResponseEntity<Boolean> saveTourist(@RequestBody User user){
        boolean saved=false;
        try{
           saved = userService.saveTourist(user);
        }catch(Exception e){
            System.out.println("Exception****************************"+ (e.getClass()));
            catchException(e);
        }
        if (saved)return new ResponseEntity<>(true, HttpStatus.OK);
        else return  new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
    @GetMapping("/tourists/{age}")
    public ResponseEntity<List<User>> getTouristByAge(@PathVariable("age") int age) throws NotFoundException {
        List<User> users =  userService.getTourists(age);
        if(users ==null || users.size()==0) throw new NotFoundException("No Tourists found");

        return new ResponseEntity<>(users,HttpStatus.FOUND);
    }
    @GetMapping("/user/{userName}")
    public ResponseEntity<User> getTouristByUserName(@PathVariable("userName") String userName) throws NotFoundException {
        User user =  userService.getTourist(userName);
        if(user ==null)throw  new NotFoundException("User is not found");
        return  new ResponseEntity<>(user, HttpStatus.FOUND);

    }
    @DeleteMapping("/tourists/delete-user/{userName}" )
    public  ResponseEntity<Boolean> deleteTourist(@PathVariable String userName){
        boolean deleted= userService.deleteTourist(userName);
        if(deleted)return  new ResponseEntity<>(true, HttpStatus.ACCEPTED);
        return new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }
}
