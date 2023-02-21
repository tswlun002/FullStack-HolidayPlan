package com.Tour.security;
import  com.google.common.collect.Sets;
import java.util.Set;

import static  com.Tour.security.UserPermission.*;
public enum UserRole {

    TOURIST(Sets.newHashSet(HOLIDAYPLAN_READ,HOLIDAYPLAN_WRITE)),
    ADMIN(Sets.newHashSet(HOLIDAYPLAN_READ,HOLIDAYPLAN_WRITE,TOURIST_READ,TOURIST_WRITE));
   private final Set<UserPermission> userPermissions;

   UserRole(Set<UserPermission> userPermissions){
       this.userPermissions=userPermissions;
   }
   public Set<UserPermission> getUserPermissions(){return userPermissions;}

}
