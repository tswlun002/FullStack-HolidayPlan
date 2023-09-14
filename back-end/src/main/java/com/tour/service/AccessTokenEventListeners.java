package com.tour.service;

import com.tour.dto.UserEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
public record AccessTokenEventListeners(AccessTokenService accessTokenService){
   @EventListener
   public  void deleteUser(@NonNull UserEvent event){
       accessTokenService.deleteAllToken(event.user());
   }

}
