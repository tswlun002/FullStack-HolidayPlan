package com.tour.repository;

import com.tour.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PermissionRepository  extends JpaRepository<Permission , Integer> {
    @Query("select p from Permission p  where p.name=:name")
    Permission findByName(String name);
    Permission findById(long id);
    @Modifying
    @Query("delete from Permission p  where p.name=:permission")
    void deletePermission(String permission);
    @Query("select p from Permission p")
    Set<Permission> findAllPermissions();
}
