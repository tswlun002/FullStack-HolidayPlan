package com.Tour.repository;

import com.Tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select t from  User t where t.userName=:userName")
    User getTourist(String userName);
    @Query("select t from  User t where t.age=:age")
    List<User> getTourists(int age);

}
