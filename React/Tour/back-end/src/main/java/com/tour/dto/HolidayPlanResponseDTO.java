package com.tour.dto;
import com.tour.model.HolidayLocationImages;
import com.tour.model.HolidayPlan;
import lombok.Builder;

import java.util.Date;
import java.util.Set;
@Builder
public record HolidayPlanResponseDTO(
        long id,
        String location,
        String city,
        Date startDate,
         Date endDate,
         String  event,
         String description,
         String priorityLevel,
         Set<HolidayLocationImages> images,
         HolidayPlan holidayPlan

                                     ) {
}
