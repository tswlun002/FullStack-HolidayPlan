package com.Tour.repository;

import com.Tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
<<<<<<< HEAD
=======

import java.time.LocalDate;
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
import java.util.List;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select u from  User u left join fetch u.roles r  left join fetch r.permissions left join fetch u.permissions p where u.username=:username")
    User getUser(String username);
<<<<<<< HEAD
   @Query("select u from User u join fetch u.roles r left join fetch r.permissions left join fetch u.permissions WHERE r.name=:roleName")
    List<User> getUsersByRole(String roleName);

    @Query("SELECT u FROM User u JOIN fetch u.roles r left join fetch r.permissions  left join fetch u.permissions p WHERE p.name=:permissionName")
    List<User> getUsersByPermission(String permissionName);
=======
    @Query("select u from  User u join fetch u.roles r where u.id=:userId")
    User getUser(long userId);
    @Query("select u from  User u join fetch u.roles r  where u.age=:age")
    List<User> getUsers(LocalDate age);
   @Query("SELECT u FROM User u JOIN fetch u.roles r WHERE r.id=:roleId")
    List<User> getUsersByRole(long roleId);
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
   @Transactional
    @Modifying
    @Query(value = "delete from `User_Role` `ur` where `ur`.`role_id` =:roleId and `ur`.`user_id` =:userId",
            nativeQuery = true)
    int deleteRoleFromUser(long roleId, long userId);
    @Transactional
    @Modifying
    @Query(value = "delete from `User_Permission` `ur` where `ur`.`permission_id` =:permissionId and `ur`.`user_id` =:userId",
            nativeQuery = true)
    int deletePermissionFromUser(long permissionId, long userId);
    @Query("select u from User u left join fetch u.roles r left join fetch r.permissions left join fetch u.permissions")
    Set<User> findAllUser();
}
