package com.Tour.service;

import com.Tour.exception.NotFoundException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Data
@Service
public class PermissionEventListeners {
    private  final RoleService service;
    @EventListener
    public  void addPermissionToRole(PermissionEvent permissionEvent) throws NotFoundException {
        service.addPermissionToRole(permissionEvent.permission());
    }
   @EventListener
   public  void  deletePermissionFromRole(PermissionEvent permissionEvent) throws NotFoundException {
       service.deletePermissionFromRoles(permissionEvent.permission());
   }

}
