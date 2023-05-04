package com.Tour.repository;

import com.Tour.model.Role;
import com.Tour.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Set;

@Repository
public interface RolesRepository  extends JpaRepository<Role, Integer> {

    @Query("select r from Role r left join fetch r.permissions where r.name=:role")
    Role getRole(UserRole role);
    @Query("select r from Role r left join fetch r.permissions where r.id=:id")
    Role getRole(long id);
    @Query("select r from  Role r left join fetch r.permissions")
    List<Role> getRoles(UserRole role);

    @Query("select r from Role r join fetch r.permissions p where p.id=:permissionId")
    List<Role> getRolesByPermission(long permissionId);
    @Query("select r from Role r join fetch r.permissions p where r.id=:roleId and p.id=:permissionId")
    Role getRole(long roleId, long permissionId);
    @Modifying
    @Query("delete from Role r where r.name=:role")
    void deleteRole(String role);

    @Modifying
    @Query(value = "delete from Role_Permission as rp where rp.role_id=:roleId and rp.permission_id=:permissionId",
            nativeQuery = true)
    void deletePermissionFromRole(long roleId, long permissionId);
    @Query("select r from Role r inner join fetch r.permissions p")
    Set<Role> findAllRoles();
}
