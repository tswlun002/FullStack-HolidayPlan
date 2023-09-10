package com.tour.service;
import com.tour.dto.UserEvent;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.VerificationToken;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
public record VerificationTokenEventListener(
        VerificationTokenService  service

) {
    /**
     * Delete the verification token for the user
     * @param event is the  user delete event
     */
    @EventListener
    void  deleteUser(UserEvent event){
        if(event.user()==null) throw  new NullException("User is invalid.");
        VerificationToken token = service.findByUserId(event.user().getId()).
                orElseThrow(()->new NotFoundException("verification token  for the user is not found"));
        service.deleteToken(token.getToken());
    }
}
