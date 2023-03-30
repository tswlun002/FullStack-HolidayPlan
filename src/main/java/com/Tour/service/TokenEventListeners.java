package com.Tour.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Data
@Service
public class TokenEventListeners {
    private  final  TokenService tokenService;
   @EventListener
   public  void onDeleteUser(TokenEvent tokenEvent){
       tokenService.deleteAllToken(tokenEvent.user());
   }

}
