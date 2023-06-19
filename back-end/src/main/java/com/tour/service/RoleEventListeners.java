package com.tour.service;
import com.tour.dto.PermissionEvent;
import com.tour.dto.RoleEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
public record RoleEventListeners(RoleService service) {
    @EventListener
    public  void addPermissionToUserRole(@NonNull RoleEvent event){
        System.out.println("########################################################################");
        var role  =event.role();
                role.getPermissions().
                        forEach(permission->
                                service.addNewPermissionToRole(role.getName(), permission.getName()));
    }
    @EventListener
    public  void deletePermissionFromRole(@NonNull PermissionEvent event){
       service.deletePermissionFromRoles(event.permission());
    }
}
