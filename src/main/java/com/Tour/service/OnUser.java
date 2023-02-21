package com.Tour.service;

import com.Tour.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OnUser {

    boolean saveTourist(User user);
    User getTourist(String userName);
    List<User> getTourists(int age);

    boolean deleteTourist(String userNameTourist);
}
