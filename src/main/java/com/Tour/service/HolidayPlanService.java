package com.Tour.service;

import com.Tour.TourApplication;
import com.Tour.model.HolidayPlan;
import com.Tour.model.User;
import com.Tour.repository.HolidayPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class HolidayPlanService  implements  OnHolidayPlan{
     @Autowired
     OnUser onUser;
    @Autowired
    HolidayPlanRepository holidayPlanRepository;

    private User getTourist(){
        return  onUser.getTourist(TourApplication.getUserName());
    }

    @Override
    public boolean saveHolidayPlan(HolidayPlan holidayPlan) {
        if(holidayPlan==null) throw  new NullPointerException("Can not save null HolidayPlan");
        try {
            holidayPlan.setUser(getTourist());
            holidayPlanRepository.save(holidayPlan);
        }catch (Exception e){
           catchException(e);
        }
        return true;
    }

    @Override
    public List<HolidayPlan> getHolidayPlans() {
        return holidayPlanRepository.getHolidayPlan(getTourist());
    }

    @Override
    public List<HolidayPlan> getHolidayPlan(String location, String city) {
        return holidayPlanRepository.getHolidayPlan(getTourist(),location,city);
    }

    @Override
    public List<HolidayPlan> getHolidayPlan(String location, String city, Date start_date) {
        return holidayPlanRepository.getHolidayPlan(getTourist(),location,city,start_date);
    }

    @Override
    public List<HolidayPlan> getHolidayPlan(String location, String city, Date start_date, Date end_date) {
        return holidayPlanRepository.getHolidayPlan(getTourist(),location,city,start_date,end_date);

    }
   @Override
   public  HolidayPlan getHolidayPlan(User user, long id){
        return  holidayPlanRepository.getHolidayPlan(user,id);
   }
    @Override
    public boolean deleteHolidayPlan(long holidayPlanId) {
        HolidayPlan holidayPlan =getHolidayPlan(getTourist(),holidayPlanId);
        if(holidayPlan==null)throw  new NullPointerException("Can not delete null HolidayPlan");
        try {
            holidayPlanRepository.delete(holidayPlan);
        }catch (Exception e){
             catchException(e);
        }
         return true;
    }
  @Override
  public boolean deleteAllHolidayPlan(User user) {
         if(user ==null) throw  new NullPointerException("Can not delete HolidayPlan of null User");
         try {
             holidayPlanRepository.deleteAll(getHolidayPlans());
         }catch (Exception e){
            catchException(e);
             return false;
         }
         return true;
    }

    @Override
    public boolean updateHolidayPlan(long holidayPlaId,int level) {
        HolidayPlan holidayPlan = getHolidayPlan(getTourist(),holidayPlaId);
        if(holidayPlan==null) throw new NullPointerException("Can not update null HolidayPlan");
        try{
            holidayPlan.setPriorityLevel(level);
            holidayPlanRepository.save(holidayPlan);
        }catch (Exception e){catchException(e);return false;}
        return true;
    }

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }
}
