package com.Tour.repository;

import com.Tour.model.HolidayLocationImages;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface HolidayImagesRepository extends JpaRepository<HolidayLocationImages, Long> {
    @Query("select h from  HolidayLocationImages h  join fetch h.holidayPlan hp where hp.id=:holidayId")
    Set<HolidayLocationImages> findByHolidayId(long holidayId);
    @Modifying
    @Transactional
    @Query(value = "delete h from HolidayPlanImages as h where h.holidayPlan_id=:holidayPlanId", nativeQuery = true)
    int deleteImageForHolidayPlan(long holidayPlanId);
}
