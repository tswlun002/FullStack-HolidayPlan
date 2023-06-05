package com.Tour.service;

import com.Tour.dto.UserEvent;
import lombok.NonNull;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
@Service
public record HolidayPlanEventListeners(HolidayPlanService holidayPlanService){
   @EventListener
   public  void deleteUser(@NonNull UserEvent event){
       holidayPlanService.deleteAllHolidayPlan(event.user());
   }

}
