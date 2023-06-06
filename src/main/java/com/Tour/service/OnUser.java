package com.Tour.service;

import com.Tour.model.*;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
=======
import java.time.LocalDate;
import java.util.List;

>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
@Service
public interface OnUser {

    boolean saveUser(User user);
<<<<<<< HEAD
=======
    User getUser(long id);
    User getUser(String userName);
    List<User> getUsers(LocalDate age);
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7

    User getUser(String username);

    boolean deleteUser(String username);


    boolean deleteRoleFromUser(String username, String roleName);
    User getLoginedUser();
    boolean addNewRoleToUser( String username,String roleName);

<<<<<<< HEAD

    public boolean deletePermissionFromUser(String username, String userPermission) ;
    public boolean addPermissionToUser( String username,String permissionName) ;
=======
    void queryIsUpdated(User user);
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
}
