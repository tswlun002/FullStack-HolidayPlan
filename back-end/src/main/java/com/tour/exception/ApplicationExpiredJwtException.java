package com.tour.exception;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Header;

public class ApplicationExpiredJwtException extends ExpiredJwtException {
    public ApplicationExpiredJwtException(Header header, Claims claims, String message) {
        super(header, claims, message);
    }
}
