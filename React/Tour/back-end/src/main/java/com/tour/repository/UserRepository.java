package com.tour.repository;

import com.tour.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select u from  User u left join fetch u.roles r  left join fetch r.permissions left join fetch u.permissions p where u.username=:username")
    User getUser(String username);
   @Query("select u from User u join fetch u.roles r left join fetch r.permissions left join fetch u.permissions WHERE r.name=:roleName")
    List<User> getUsersByRole(String roleName);

    @Query("SELECT u FROM User u JOIN fetch u.roles r left join fetch r.permissions  left join fetch u.permissions p WHERE p.name=:permissionName")
    List<User> getUsersByPermission(String permissionName);
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
