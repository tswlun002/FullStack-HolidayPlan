package com.Tour.repository;


import com.Tour.model.HolidayPlan;
import com.Tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface HolidayPlanRepository extends JpaRepository<HolidayPlan, Integer> {

    @Query("select h from  HolidayPlan h join fetch h.user t where t=:user")
    List<HolidayPlan> getHolidayPlan(User user);
    @Query("select h from  HolidayPlan h join fetch h.user t where t=:user and h.id=:id")

    HolidayPlan getHolidayPlan(User user, long id);
    @Query("select h from  HolidayPlan h join fetch h.user t where t=:user and " +
            " h.location=:location and h.city=:city")
    List<HolidayPlan> getHolidayPlan(User user, String location, String city);
    @Query("select h from  HolidayPlan h join fetch h.user t where t=:user and  " +
            "h.location=:location and h.city=:city and h.startDate=:start_date")

    List<HolidayPlan> getHolidayPlan(User user, String location, String city, Date start_date);
    @Query("select h from  HolidayPlan h join fetch h.user t where t=:user and " +
            "  h.location=:location and h.city=:city and" +
            " h.startDate=:start_date  and h.endDate=:end_date")
    List<HolidayPlan> getHolidayPlan(User user, String location, String city, Date start_date, Date end_date);

}
