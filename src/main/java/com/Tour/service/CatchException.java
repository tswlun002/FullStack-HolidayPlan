package com.Tour.service;

import com.Tour.exception.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;

import javax.validation.ConstraintViolationException;

public class
CatchException {
    public  static  void catchException(Exception e) {
        if (e instanceof DuplicateKeyException) throw new DuplicateException(e.getMessage());
        else if (e instanceof NullPointerException) throw new NullException(e.getMessage());
        else if (e instanceof ConstraintViolationException) throw  new
                ApplicationConstrainViolationException(((ConstraintViolationException) e).getConstraintViolations());
        else if(e instanceof DataIntegrityViolationException) throw new ApplicationDataIntegrityViolationException("Duplicate userName");
        else ApplicationExceptionHandler.builder().build();
    }
}
