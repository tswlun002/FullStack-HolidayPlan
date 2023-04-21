package com.Tour.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Data
@Service
public class QueryEventListeners {
    private  final  QueryService queryService;
   @EventListener
   public  void onDeleteUser(QueryEvent queryEvent){
       queryService.deleteUserQueries(queryEvent.user());
   }

}
