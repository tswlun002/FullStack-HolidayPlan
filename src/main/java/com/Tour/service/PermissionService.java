package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.exception.DuplicateException;
import com.Tour.exception.NotFoundException;
import com.Tour.model.Permission;
import com.Tour.model.UserPermission;
import com.Tour.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class PermissionService  implements  OnPermission{

    @Autowired private PermissionRepository repository;
    @Autowired
    private ApplicationEventPublisher publisher;

    private  void catchException(Exception e){
        CatchException.catchException(e);
    }
    @Override
    public void save(Permission permission) {
           if(permission==null) throw  new NullPointerException("Permission is invalid");
           else if(exist(permission)) throw  new DuplicateException("Permission already exists");
           else {
               try {
                   permission = Permission.builder().name(UserPermission.valueOf(permission.getName().name())).build();
                   repository.save(permission);
                   //publisher.publishEvent(new PermissionEvent(permission));
               } catch (Exception e) {
                   System.out.println(e.toString());
                   catchException(e);
               }
           }
    }

    private boolean exist(Permission permission) {
        return getPermission(permission.getName()) != null;
    }

    @Override
    public Permission getPermission(UserPermission userPermission) {
        return repository.findByName(userPermission);
    }

    @Override
    public Set<Permission> getPermissions() {
        return repository.findAllPermissions();
    }

    @Override
    public Permission getPermission(long id) {
        return repository.findById(id);
    }

    @Override
    public boolean deletePermission(long id) throws NotFoundException {
        Permission permission = getPermission(id);
        if(permission==null)throw new NotFoundException("Exception can not be found");
        publisher.publishEvent(new PermissionEvent(permission));

        try{
            repository.delete(permission);
        }catch (Exception e){catchException(e);}

        return true;
    }

    @Transactional
    @Modifying
    @Override
    public boolean deletePermission(UserPermission userPermission) {
        boolean deleted = false;
        if(userPermission==null)throw  new NullPointerException("UserPermission is invalid");

        try{

            publisher.publishEvent(new PermissionEvent(getPermission(userPermission)));
            repository.deletePermission(userPermission);
            deleted=true;
        }catch (Exception e){
            System.out.println(e.toString());
            catchException(e);
        }

        return deleted;
    }

}

