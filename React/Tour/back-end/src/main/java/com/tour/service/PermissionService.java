package com.tour.service;

import com.tour.dto.PermissionEvent;
import com.tour.exception.CatchException;
import com.tour.exception.DuplicateException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.Permission;
import com.tour.repository.PermissionRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;
@AllArgsConstructor
@Service
public class PermissionService  implements  OnPermission{

    private final  PermissionRepository repository;

    private  final ApplicationEventPublisher publisher;

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }

    /**
     * Save Permission
     * @param permission  is the permission to save
     * @exception  NullPointerException throw null exception is the permission to save is null
     * @exception  DuplicateException throw duplicate exception if the permission already exists
     */
    @Override
    public void save(Permission permission) {
           if(permission==null) throw  new NullException("Permission is invalid");
           else if(exist(permission)) throw  new DuplicateException("Permission already exists");
           else {
               try {
                   permission.setName(permission.getName().toUpperCase());
                   repository.save(permission);
               } catch (Exception e) {
                   catchException(e);
               }
           }
    }

    /**
     * Check is permission exits
     * @param permission is the permission to check
     * @return true if permission exists else false
     */
    private boolean exist(Permission permission) {
        return getPermission(permission.getName()) != null;
    }

    /**
     * Retrieve permission by permission name
     * @param permissionName is string name of the permission
     * @return permission of the given name
     */
    @Override
    public Permission getPermission(String permissionName) {
        return repository.findByName(permissionName);
    }

    /**
     * Retrieve all permissions
     * @return Set of Permission
     */
    @Override
    public Set<Permission> getPermissions() {
        return repository.findAllPermissions();
    }

    /**
     * Get permission by id
     * @param id  of permission to retrieve
     * @return  permission if id has corresponding permission  else null
     */
    @Override
    public Permission getPermission(long id) {
        return repository.findById(id);
    }

    /**
     * delete permission by id
     * @param id  of the permission
     * @return true m when permission is deleted else false
     * @throws  NotFoundException if the permission is not found of the given id
     */
    @Override
    public boolean deletePermission(long id) throws NotFoundException {
        Permission permission = getPermission(id);
        if(permission==null)throw new NotFoundException("Permission is not found");
        try{
            publisher.publishEvent(new PermissionEvent(permission));
            repository.delete(permission);
        }catch (Exception e){catchException(e);}
        return true;
    }

    /**
     * delete permission by name
     * @param permissionName is the name of the permission
     * @return true m when permission is deleted else false
     * @throws  NotFoundException if the permission is not found of the given name
     */
    @Transactional
    @Modifying
    @Override
    public boolean deletePermission(String permissionName) {
        var permission  = getPermission(permissionName);
        if(permission==null) throw  new NotFoundException("Permission is not found");
        boolean deleted = false;
        try{
            publisher.publishEvent(new PermissionEvent(permission));
            repository.deletePermission(permission.getName());
            deleted=true;
        }catch (Exception e){
            catchException(e);
        }
        return deleted;
    }

}

