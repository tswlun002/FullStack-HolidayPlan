package com.tour.service;

import com.tour.dto.UserEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
public record TokenEventListeners(TokenService tokenService){
   @EventListener
   public  void deleteUser(@NonNull UserEvent event){
       tokenService.deleteAllToken(event.user());
   }

}
