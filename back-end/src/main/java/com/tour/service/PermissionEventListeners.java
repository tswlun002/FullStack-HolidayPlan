package com.tour.service;

import com.tour.dto.PermissionEvent;
import com.tour.exception.NotFoundException;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Data
@Service
public class PermissionEventListeners {
    private  final RoleService service;
   @EventListener
   public  void  deletePermissionFromRole(@NonNull PermissionEvent permissionEvent) throws NotFoundException {
       service.deletePermissionFromRoles(permissionEvent.permission());
   }

}
