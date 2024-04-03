package com.tour.service;
import com.tour.dto.UserEvent;
import com.tour.exception.InvalidToken;
import com.tour.model.SecurityDataChangeToken;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

@Service
public record PasswordTokenEventListener(
        ISecurityDataChange service

) {
    /**
     * Delete the password reset token  for the user
     * @param event is the  user delete event
     */
    @EventListener
    void  deleteUser(UserEvent event){
        if(event.user()==null) throw  new InvalidToken("User is invalid.");
        service.findByUserId(event.user().getId()).ifPresent( service::delete);
    }
}
