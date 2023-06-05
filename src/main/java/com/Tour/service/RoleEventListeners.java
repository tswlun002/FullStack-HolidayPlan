package com.Tour.service;
import com.Tour.dto.PermissionEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
public record RoleEventListeners(RoleService service) {
    @EventListener
    public  void deletePermissionFromRole(@NonNull PermissionEvent event){
       service.deletePermissionFromRoles(event.permission());
    }
}
