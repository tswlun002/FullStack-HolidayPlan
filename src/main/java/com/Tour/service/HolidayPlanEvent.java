package com.Tour.service;


import com.Tour.model.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class HolidayPlanEvent {
    private final User user;
}
