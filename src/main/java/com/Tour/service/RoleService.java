package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.exception.DuplicateException;
import com.Tour.exception.NotFoundException;
import com.Tour.model.*;
import com.Tour.repository.RolesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.util.Set;


import static com.Tour.model.UserPermission.*;

@Service
public class RoleService implements  OnRole{
    @Autowired
    private RolesRepository rolesRepository;
    @Autowired
    private ApplicationEventPublisher publisher;
    @Autowired private OnPermission onPermission;


    @Override
    public void saveRole(Role role) {
      if(role==null)throw  new NullPointerException("Can not save invalid role");
      else if(exist(role)) throw new DuplicateException("Role already exists");
      else {
          try {

              addDefaultPermission(role);
              rolesRepository.save(role);

          } catch (Exception e) {

              catchException(e);
          }


      }

    }

    private  void addDefaultPermission(Role role){
        if (role.getName() == UserRole.USER) {
            addPermissions(role, Set.of(HOLIDAYPLAN_WRITE, HOLIDAYPLAN_READ));
        } else if (role.getName() == UserRole.ADMIN) {
            addPermissions(role, Set.of(HOLIDAYPLAN_WRITE, HOLIDAYPLAN_READ, USER_WRITE, USER_READ,QUERY_WRITE,QUERY_READ));
        }
    }

    /**
     * Add permission to role
     * @param role to add permissions into
     * @param permissions to be added to role
     */
   private  void addPermissions(Role role,Set<UserPermission>permissions){

       for(UserPermission userPermission: permissions){
           var permission = onPermission.getPermission(userPermission);
           if(permission == null) throw  new NotFoundException("Permission is not found");
           role.getPermissions().add(permission);
       }
   }



    /**
     * Invoke permission to update about the added role
     * @param role being added
     */
   private  void publicRoleEvent(Role role){
      publisher.publishEvent(new RoleEvent(role));

   }
   @Override
  public boolean addNewPermissionToRole(UserRole userRole, UserPermission userPermission)  {
       Role role = getRole(userRole);
       if(role==null )throw  new NotFoundException("Role is not found");

      try {
          addPermissions(role,Set.of(userPermission));
          updateRole(role);

      }catch (Exception e){
          catchException(e);
      }

      return true;

   }

    @Override
    public void addPermissionToRole(Permission permission) {
       if(permission==null)throw  new NullPointerException("Can add invalid Permission to Role");
       var roles = rolesRepository.getRolesByPermission(permission.getId());

       roles.forEach(role ->
               {
                    role.getPermissions().add(permission);
                    updateRole(role);
               }

       );
    }

    /**
     * Saves updated role
     * @param role is the role to be saved
     */
    private void updateRole(Role role){
       try{
           rolesRepository.save(role);
       }catch (Exception e){
           catchException(e);
       }
    }

    /**
     * Check is the role exist
     * @param role is the role to be checked
     * @Return true if the role exist
     * @Return false if the role does not exist
     * @throws  NullPointerException is the role to checked is null
     */
    private boolean exist(Role role) {
        if(role==null)throw  new NullPointerException("Role is invalid");
        return getRole(role.getName()) != null;
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
     * Find the role by userRole
     * @param userRole is the name of the role to find
     * @Return role is the role  exists
     * @Return  null is the role does not exits
     */

    @Override
    public Role getRole(UserRole userRole) {
        return rolesRepository.getRole(userRole);
    }
    /**
     * Delete Permission from role(s)
     * @param permission is the permission to remove from role(s)
     * @throws  NullPointerException if the permission to be removed is null
     */
    @Override
    public  void deletePermissionFromRoles(Permission permission){
       if(permission==null)throw  new NullPointerException("Permission is invalid");
       var roles  = rolesRepository.getRolesByPermission(permission.getId());
       roles.forEach(
               role -> {
                   rolesRepository.deletePermissionFromRole(role.getId(), permission.getId());
                   updateRole(role);
               }
       );
    }

    /**
     * Delete Permission from role
     * @param userRole is the role name where to remove permission
     * @param userPermission is the permission to remove from role
     * @return true if the permission is  removed
     * @Return  false if the permission is not removed
     * @throws  NotFoundException if the permission or role do not exist
     */
    @Modifying
    @Transactional
    @Override
    public boolean deletePermissionFromRole(UserRole userRole, UserPermission userPermission) {
        Role role = getRole(userRole);

        if(role==null )throw  new NotFoundException("Role is not found");
        var permissions =  role.getPermissions().stream().map(permission1 ->
                (permission1.getName()==userPermission) ? permission1 : null).toList();

        if(permissions.get(0)==null)throw  new NotFoundException("Permission is not found");

        boolean deleted  =false;

        try {
            rolesRepository.deletePermissionFromRole(role.getId(), permissions.get(0).getId());
            updateRole(role);
            deleted = true;

        } catch (Exception e) {
            catchException(e);
        }



        return deleted;
    }

    @Override
    public Set<Role> getRoles() {
        return rolesRepository.findAllRoles();
    }


    @Override
    public boolean deleteRole(UserRole userRole) {

        if(userRole==null)throw  new NullPointerException("UserRole is invalid");
        var role = getRole(userRole);
        if(role==null) throw  new NullPointerException("Role  is invalid");

        boolean deleted = false;
        try {
            publisher.publishEvent(new RoleEvent(role));
            rolesRepository.delete(role);
            deleted=true;
        }catch (Exception e){
            System.out.println(e.toString());
            catchException(e);
        }
        return deleted;
    }

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }

}
