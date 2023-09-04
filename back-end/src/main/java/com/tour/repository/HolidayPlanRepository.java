package com.tour.repository;


import com.tour.model.HolidayPlan;
import com.tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface HolidayPlanRepository extends JpaRepository<HolidayPlan, Integer> {

    @Query("select h from  HolidayPlan h join fetch h.user u where u.id=:userId")
    Set<HolidayPlan> getHolidayPlan(long userId);
    @Query("select h from  HolidayPlan h join fetch h.user t where t=:user and h.id=:id")
    HolidayPlan getHolidayPlan(User user, long id);

    @Query("select h from HolidayPlan h join fetch h.user u where " +
            "u.username=:username and ( " +
            "h.city in (:city) or " +
            "h.location in (:location) or " +
            "h.startDate in (:startDate) or " +
            "h.endDate in (:endDate) or " +
            "h.event in (:event) or "+
            "h.priorityLevel in (:priorityLevel))")
    Set<HolidayPlan> filterHolidayPlans(String username,List<String> city, List<String>  location, List<Date> startDate,
                                        List<Date>  endDate, List<String> event, List<Integer> priorityLevel);

}
