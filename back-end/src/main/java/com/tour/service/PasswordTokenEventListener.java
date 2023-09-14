package com.tour.service;
import com.tour.dto.UserEvent;
import com.tour.exception.InvalidToken;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.PasswordResetToken;
import com.tour.model.VerificationToken;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public record PasswordTokenEventListener(
        OnPasswordReset  service

) {
    /**
     * Delete the verification token for the user
     * @param event is the  user delete event
     */
    @EventListener
    void  deleteUser(UserEvent event){
        if(event.user()==null) throw  new InvalidToken("User is invalid.");
        PasswordResetToken token = service.findByUserId(event.user().getId()).
                orElseThrow(()->new NotFoundException("password reset verification is  not found"));
        service.delete(token);
    }
}
