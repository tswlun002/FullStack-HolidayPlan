package com.tour.service;

import com.tour.dto.HolidayPlaDTO;
import com.tour.model.HolidayPlan;
import com.tour.model.User;
import jakarta.servlet.http.Part;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public interface IHolidayPlan {
  boolean saveHolidayPlan(HolidayPlaDTO dto, List<Part> images);
  Set<HolidayPlan> getHolidayPlans();


  HolidayPlan getHolidayPlan(User user, long id);
  boolean deleteHolidayPlan(long holidayPlanId);
  boolean deleteAllHolidayPlan(User user);

  boolean updateHolidayPlan(long id,int level);





}
