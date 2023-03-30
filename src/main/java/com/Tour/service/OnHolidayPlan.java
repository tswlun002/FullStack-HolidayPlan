package com.Tour.service;

import com.Tour.model.HolidayPlan;
import com.Tour.model.User;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Set;

@Service
public interface OnHolidayPlan {
  boolean saveHolidayPlan(HolidayPlan holidayPlan);
  Set<HolidayPlan> getHolidayPlans();
  Set<HolidayPlan> getHolidayPlan(String location, String city);
  Set<HolidayPlan> getHolidayPlan(String location, String city, Date start_date);
  Set<HolidayPlan> getHolidayPlan(String location, String city, Date start_date, Date end_date);
  HolidayPlan getHolidayPlan(User user, long id);
  boolean deleteHolidayPlan(long holidayPlanId);
  boolean deleteAllHolidayPlan(User user);

  boolean updateHolidayPlan(long id,int level);





}
