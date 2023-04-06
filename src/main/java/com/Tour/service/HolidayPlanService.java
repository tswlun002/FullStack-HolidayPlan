package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.model.HolidayPlan;
import com.Tour.model.User;
import com.Tour.repository.HolidayPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Set;

@Service
public class HolidayPlanService  implements  OnHolidayPlan{
     @Autowired
     private OnUser onUser;
    @Autowired
    private HolidayPlanRepository holidayPlanRepository;


    @Override
    public boolean saveHolidayPlan(HolidayPlan holidayPlan) {
        System.out.println(holidayPlan);
        if(holidayPlan==null) throw  new NullPointerException("Can not save null HolidayPlan");
        try {
            holidayPlan.setUser(onUser.getLoginedUser());
            holidayPlanRepository.save(holidayPlan);
        }catch (Exception e){
           CatchException.catchException(e);
        }
        return true;
    }

    @Override
    public Set<HolidayPlan> getHolidayPlans() {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser());
    }

    @Override
    public Set<HolidayPlan> getHolidayPlan(String location, String city) {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser(),location,city);
    }

    @Override
    public Set<HolidayPlan> getHolidayPlan(String location, String city, Date start_date) {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser(),location,city,start_date);
    }

    @Override
    public Set<HolidayPlan> getHolidayPlan(String location, String city, Date start_date, Date end_date) {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser(),location,city,start_date,end_date);

    }
   @Override
   public  HolidayPlan getHolidayPlan(User user, long id){
        return  holidayPlanRepository.getHolidayPlan(user,id);
   }
    @Override
    public boolean deleteHolidayPlan(long holidayPlanId) {
        HolidayPlan holidayPlan =getHolidayPlan(onUser.getLoginedUser(),holidayPlanId);
        if(holidayPlan==null)throw  new NullPointerException("Can not delete null HolidayPlan");
        try {
            holidayPlanRepository.delete(holidayPlan);
        }catch (Exception e){
             CatchException.catchException(e);
        }
         return true;
    }
  @Override
  public boolean deleteAllHolidayPlan(User user) {
         if(user ==null) throw  new NullPointerException("Can not delete HolidayPlan of null User");
         try {
             holidayPlanRepository.deleteAll(getHolidayPlans());
         }catch (Exception e){
            CatchException.catchException(e);
             return false;
         }
         return true;
    }

    @Override
    public boolean updateHolidayPlan(long holidayPlaId,int level) {
        HolidayPlan holidayPlan = getHolidayPlan(onUser.getLoginedUser(),holidayPlaId);
        if(holidayPlan==null) throw new NullPointerException("Can not update null HolidayPlan");
        try{
            holidayPlan.setPriorityLevel(level);
            holidayPlanRepository.save(holidayPlan);
        }catch (Exception e){CatchException.catchException(e);return false;}
        return true;
    }


}
