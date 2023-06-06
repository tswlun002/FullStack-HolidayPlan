package com.Tour.service;

<<<<<<< HEAD
import com.Tour.dto.UserEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public record QueryEventListeners(QueryService queryService) {
   @EventListener
   public  void deleteUser(@NonNull UserEvent event){
       queryService.deleteUserQueries(event.user());
=======
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
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
   }

}
