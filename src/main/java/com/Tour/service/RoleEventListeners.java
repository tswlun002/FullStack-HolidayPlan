package com.Tour.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Data
@Service
public class RoleEventListeners {
    private  final  UserService userService;
    @EventListener
    public  void deleteRoleFromUser(RoleEvent event){
       userService.deleteRoleFromUser(event.role());
    }


}
