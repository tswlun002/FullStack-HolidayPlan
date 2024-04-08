package com.tour.exception;

import org.springframework.security.access.AccessDeniedException;

public class UserAccessDeniedException extends AccessDeniedException {
    public UserAccessDeniedException(String s) {
        super(s);
    }
}
