package com.tour.service;

import com.tour.dto.RoleEvent;
import com.tour.exception.CatchException;
import com.tour.exception.DuplicateException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.Permission;
import com.tour.model.Role;
import com.tour.repository.RolesRepository;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
@Service
@AllArgsConstructor
public class RoleService implements  OnRole{

    private final RolesRepository rolesRepository;
    private final ApplicationEventPublisher publisher;
    private final OnPermission onPermission;
    private final Environment environment;

    /**
     * Retrieve name of the default role
     * @return array of string name of default role
     */
    @Override
     public String[] getNamesDefaultRoles(){
         String names = environment.getProperty("role.default.names");
         if(names==null)throw  new NullException("Invalid default role names ");
         return names.split(",");

     }
    /**
     * Save defaulted role
     */
    @PostConstruct
    protected void saveDefaultRole() {

        try{
            if (rolesRepository.count() == 0) {
                var names = getNamesDefaultRoles();
                var permissions = Arrays.stream(onPermission.getNamesDefaultedPermission()).
                        map(onPermission::getPermission).collect(Collectors.toSet());
                for (var name : names) {
                    var role = Role.builder().permissions(permissions).name(name.toUpperCase()).build();
                    rolesRepository.save(role);
                }
            }
        }
        catch(Exception e){
            CatchException.catchException(e);

        }
    }
    /**
     * Save role
     * @param role is the role to save
     * @throws  NullException if the given role is null
     * @throws  DuplicateException if the role to save is already exists
     */
    @Override
    public void saveRole(Role role) {
      if(role==null)throw  new NullException("Role is invalid");
      else if(exist(role.getName())) throw new DuplicateException("Role already exists");
      try {
          role.setName(role.getName().toUpperCase());
          rolesRepository.save(role);
      } catch (Exception e) {
          catchException(e);
      }
    }
    /**
     * Add permission into role
     * @param roleName is the name of role
     * @param permissionName  is the name permission to add into role
     * @return true if the permission is added into role else false
     */
   @Override
  public boolean addNewPermissionToRole(String roleName, String permissionName)  {
        Role role = getRole(roleName);
        if(role==null )throw  new NotFoundException("Role is not found");
        var permission = onPermission.getPermission(permissionName);
        if(permission == null) throw  new NotFoundException("Permission is not found");
        var added = false;
        try {
            role.getPermissions().add(permission);
            updateRole(role);
            added=true;
        }catch (Exception e){
            catchException(e);
        }
        return added;
   }

    /**
     * Saves updated role
     * @param role is the role to be saved
     * @Return  Role with updated information
     */
    private Role updateRole(Role role){
        System.out.println("*******************************************\n"
        + role);
       try{
           role.setName(role.getName().toUpperCase());
          role= rolesRepository.save(role);
       }catch (Exception e){
           catchException(e);
       }
       return role;
    }

    /**
     * Check is the role exist
     * @param name is the name of  role to be checked
     * @Return true if the role exist
     * @Return false if the role does not exist
     * @throws  NullPointerException is the role to checked is null
     */
    private boolean exist(String name) {
        return getRole(name) != null;
    }

    /**
     * Find the role by id
     * @param id is the id of the role to find
     * @Return role is the role exists
     * @Return  null is the role does not exits
     */
    @Override
    public Role getRole(long id) {
        return rolesRepository.getRole(id);
    }
    /**
     * Find the role by roles
     * @param roleName is the name of the role to find
     * @Return role is the role  exists
     * @Return  null is the role does not exits
     */

    @Override
    public Role getRole(String roleName) {
        return rolesRepository.getRole(roleName);
    }
    /**
     * Delete Permission from role(s)
     * @param permission is the permission to remove from role(s)
     * @throws  NullPointerException if the permission to be removed is null
     */
    @Override
    public  void deletePermissionFromRoles(Permission permission){
       if(permission==null)throw  new NullException("Permission is invalid");
       var roles  = rolesRepository.getRolesByPermission(permission.getName());
       roles.forEach(
               role -> {
                  var deleted= rolesRepository.deletePermissionFromRole(role.getId(), permission.getId());
                  if(deleted==1) updateRole(role);
               }
       );
    }

    /**
     * Delete Permission from role
     *
     * @param roleName       is the role name where to remove permission
     * @param permissionName is the permission to remove from role
     * @return true if the permission is  removed
     * @throws NotFoundException if the permission or role do not exist
     * @Return false if the permission is not removed
     */
    @Modifying
    @Transactional
    @Override
    public boolean deletePermissionFromRole(String roleName, String permissionName) {
        Role role = getRole(roleName);
        if(role==null )throw  new NotFoundException("Role is not found");
        var permissions =  role.getPermissions().stream().filter(permission1 ->
                permission1.getName().equals(permissionName)).toList();
        if(permissions.get(0)==null)throw  new NotFoundException("Permission is not found");
        boolean deleted  =false;
        try {
           deleted= rolesRepository.deletePermissionFromRole(role.getId(), permissions.get(0).getId())==1;
            if(deleted){
                updateRole(role);
            }
        } catch (Exception e) {
            catchException(e);
        }
        return deleted;
    }

    /**
     * Retrieve all roles
     * @return set of roles if there are saved roles else null
     */
    @Override
    public Set<Role> getRoles() {
        return rolesRepository.getRoles();
    }

    /**
     * Delete role
     * @param roleName is the name of role to delete
     * @return true if the role is deleted else false
     */
    @Override
    public boolean deleteRole(String roleName) {
        var role = getRole(roleName);
        if(role==null) throw  new NullPointerException("Role is invalid");
        boolean deleted = false;
        try {
            publisher.publishEvent(new RoleEvent(role));
            var numberPermissions = role.getPermissions().size();
            AtomicInteger deletedPermissions  = new AtomicInteger();
            role.getPermissions().forEach(permission -> {
                var value  =
                        rolesRepository.deletePermissionFromRole(role.getId(),
                                permission.getId());
                if(value==1) deletedPermissions.incrementAndGet();
            });
            deleted=deletedPermissions.get()==numberPermissions;
            if(deleted)rolesRepository.delete(role);
        }catch (Exception e){
            catchException(e);
        }
        return deleted;
    }

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }

}
