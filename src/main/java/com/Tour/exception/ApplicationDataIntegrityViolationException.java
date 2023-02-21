package com.Tour.exception;

import org.springframework.dao.DataIntegrityViolationException;

public class ApplicationDataIntegrityViolationException extends DataIntegrityViolationException {
    public ApplicationDataIntegrityViolationException(String msg) {
        super(msg);
    }

    public ApplicationDataIntegrityViolationException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
