package com.Tour.repository;


import com.Tour.model.HolidayPlan;
import com.Tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Set;

@Repository
public interface HolidayPlanRepository extends JpaRepository<HolidayPlan, Integer> {

    @Query("select h from  HolidayPlan h join fetch h.user u where u.id=:userId")
    Set<HolidayPlan> getHolidayPlan(long userId);
    @Query("select h from  HolidayPlan h join fetch h.user t where t=:user and h.id=:id")
    HolidayPlan getHolidayPlan(User user, long id);


}
