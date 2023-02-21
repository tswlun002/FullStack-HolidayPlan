package com.Tour.security;

public enum UserPermission {
    TOURIST_READ("user:read"),
    TOURIST_WRITE("user:write"),
    HOLIDAYPLAN_READ("holidayPlan:read"),
    HOLIDAYPLAN_WRITE("holidayPlan:write");

    private final String permission;
    UserPermission(String permission){
        this.permission=permission;
    }

    public  String getPermission(){
        return permission;
    }

}
