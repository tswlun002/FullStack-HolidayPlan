package com.Tour.service;
import com.Tour.model.User;
import com.Tour.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements OnUser {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ApplicationEventPublisher publisher;


    @Override
    public boolean saveTourist(User user)
    {
        if(user ==null) throw  new NullPointerException("Can not save null User");
        try {
            userRepository.save(user);
        }catch(Exception e){
            catchException(e);
        }
        return true;
    }
    @Override
    public User getTourist(String userName) {
        return userRepository.getTourist(userName);
    }

    @Override
    public List<User> getTourists(int age) {
        return userRepository.getTourists(age);
    }

    @Override
    public boolean deleteTourist(String  userName) {
        User user = getTourist(userName);
        if(user ==null)throw  new NullPointerException("Can not delete null User");
        try {
            publisher.publishEvent(new HolidayPlanEvent(user));
            userRepository.delete(user);
        }catch (Exception e){catchException(e);}

        return true;
    }

    private  void catchException(Exception e){
       CatchException.catchException(e);
    }

}
