package com.Tour.service;

import com.Tour.model.HolidayPlan;
import com.Tour.model.User;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public interface OnHolidayPlan {
  boolean saveHolidayPlan(HolidayPlan holidayPlan);
  List<HolidayPlan> getHolidayPlans();
  List<HolidayPlan> getHolidayPlan(String location, String city);
  List<HolidayPlan> getHolidayPlan(String location, String city, Date start_date);
  List<HolidayPlan> getHolidayPlan(String location, String city, Date start_date, Date end_date);
  HolidayPlan getHolidayPlan(User user, long id);
  boolean deleteHolidayPlan(long holidayPlanId);
  boolean deleteAllHolidayPlan(User user);

    boolean updateHolidayPlan(long id,int level);
}
