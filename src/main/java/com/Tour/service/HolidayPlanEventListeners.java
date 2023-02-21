package com.Tour.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Data
@Service
public class HolidayPlanEventListeners {
    private  final  HolidayPlanService holidayPlanService;
   @EventListener
   public  void onDeleteTourist(HolidayPlanEvent holidayPlanEvent){
       holidayPlanService.deleteAllHolidayPlan(holidayPlanEvent.getUser());
   }

}
