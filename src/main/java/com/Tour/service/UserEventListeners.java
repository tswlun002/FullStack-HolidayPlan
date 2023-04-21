package com.Tour.service;

import com.Tour.exception.NotFoundException;
import com.Tour.model.UserRole;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.Set;

import static com.Tour.model.UserPermission.*;

@RequiredArgsConstructor
@Data
@Service
public class UserEventListeners {
    private  final  UserService service;
    @EventListener

    public  void queryIsUpdated(UserEvent userEvent){
        service.queryIsUpdated(userEvent.user());
    }


}
