package com.Tour.repository;

import com.Tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select u from  User u left join fetch u.roles r  where u.username=:username")
    User getUser(String username);
    @Query("select u from  User u join fetch u.roles r where u.id=:userId")
    User getUser(long userId);
    @Query("select u from  User u join fetch u.roles r  where u.age=:age")
    List<User> getUsers(LocalDate age);
   @Query("SELECT u FROM User u JOIN fetch u.roles r WHERE r.id=:roleId")
    List<User> getUsersByRole(long roleId);
   @Transactional
    @Modifying
    @Query(value = "delete from `User_Role` `ur` where `ur`.`role_id` =:roleId and `ur`.`user_id` =:userId",
            nativeQuery = true)
    void deleteRoleFromUser(long roleId, long userId);
    @Query("select u from User u left join fetch u.roles ")
    Set<User> findAllUser();
}
