package com.tour.exception;


import io.jsonwebtoken.ExpiredJwtException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;


public class
CatchException {
    public  static  void catchException(Exception e) {

        if (e instanceof DuplicateKeyException) throw new DuplicateException(e.getMessage());
        else if (e instanceof NullPointerException) throw new NullException(e.getMessage());
        else if (e instanceof ConstraintViolationException) throw  new
                ApplicationConstrainViolationException(((ConstraintViolationException) e).getConstraintViolations());
        else if(e instanceof DataIntegrityViolationException)
            throw new ApplicationDataIntegrityViolationException(e.getMessage());
        else if (e instanceof NotFoundException) throw new NotFoundException(e.getMessage());
        else if(e instanceof ExpiredJwtException)throw  new ApplicationExpiredJwtException(null,null, "Need to login");

        else throw  new AppInternalException("App internal exception\n" +e.toString());
    }
}
