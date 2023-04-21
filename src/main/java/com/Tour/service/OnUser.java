package com.Tour.service;

import com.Tour.model.Role;
import com.Tour.model.User;
import com.Tour.model.UserRole;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface OnUser {

    boolean saveUser(User user);
    User getUser(long id);
    User getUser(String userName);
    List<User> getUsers(LocalDate age);

    boolean deleteUser(String userNameTourist);

    void deleteRoleFromUser(Role role);
    boolean deleteRoleFromUser(String userName, UserRole userRole);
    User getLoginedUser();
    boolean addNewRoleToUser(UserRole userRole,String userName);


    void queryIsUpdated(User user);
}
