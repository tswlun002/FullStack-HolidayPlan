package com.Tour.exception;

import org.springframework.dao.DuplicateKeyException;


public class DuplicateException extends DuplicateKeyException {

    public DuplicateException(String msg) {
        super(msg);
    }

    public DuplicateException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
