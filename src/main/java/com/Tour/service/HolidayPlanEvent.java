package com.Tour.service;


import com.Tour.model.User;
import lombok.Data;
import lombok.RequiredArgsConstructor;



public record HolidayPlanEvent(User user) {
}
