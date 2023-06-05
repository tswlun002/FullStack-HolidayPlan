package com.Tour.repository;

import com.Tour.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Set;


@Repository
public interface RolesRepository  extends JpaRepository<Role, Integer> {

    @Query("select r from Role r left join fetch r.permissions")
    Set<Role> getRoles();

    @Query("SELECT CASE WHEN EXISTS(SELECT 1 FROM Role R where  R.name=:name) " +
            "THEN true ELSE false  END")
    boolean checkRoleExitsByName(String name);

    @Query("select r from Role r left join fetch r.permissions where r.name=:roleName")
    Role getRole(String roleName);
    @Query("select r from Role r left join fetch r.permissions where r.id=:id")
    Role getRole(long id);

    @Query("select r from Role r  join fetch r.permissions p where p.name=:name")
    List<Role> getRolesByPermission(String name);

    @Modifying
    @Query(value = "delete from Role_Permission as rp where rp.role_id=:roleId and rp.permission_id=:permissionId",
            nativeQuery = true)
    int deletePermissionFromRole(long roleId, long permissionId);
     @Query("select r from Role r join fetch r.permissions")
    Set<Role> findAllRoles();
}
