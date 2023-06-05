package com.Tour.service;
import com.Tour.dto.PermissionEvent;
import com.Tour.dto.RoleEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
public record UserEventListeners(UserService service) {
    @EventListener
    public  void deleteRole(@NonNull RoleEvent event){
        service.deleteRoleFromUser(event.role());
    }
    @EventListener
    public  void deletePermission(@NonNull PermissionEvent event){
        service.deletePermissionFromUser(event.permission());
    }

}
