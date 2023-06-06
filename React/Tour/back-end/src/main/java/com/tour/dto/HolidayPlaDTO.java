package com.tour.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;


public record HolidayPlaDTO(
        String location,
        String city,
        @JsonFormat(pattern="yyyy-MM-dd") Date startDate,
        @JsonFormat(pattern="yyyy-MM-dd") Date endDate,
        String  event,
       String description,
       String priorityLevel
) {
}
