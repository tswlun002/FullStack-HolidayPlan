package com.Tour.service;
import com.Tour.dto.PermissionEvent;
import com.Tour.dto.RoleEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
<<<<<<< HEAD
public record UserEventListeners(UserService service) {
    @EventListener
    public  void deleteRole(@NonNull RoleEvent event){
        service.deleteRoleFromUser(event.role());
    }
    @EventListener
    public  void deletePermission(@NonNull PermissionEvent event){
        service.deletePermissionFromUser(event.permission());
    }
=======
public class UserEventListeners {
    private  final  UserService service;
    @EventListener

    public  void queryIsUpdated(UserEvent userEvent){
        service.queryIsUpdated(userEvent.user());
    }

>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7

}
