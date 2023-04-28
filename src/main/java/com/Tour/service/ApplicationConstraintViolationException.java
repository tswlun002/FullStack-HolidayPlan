package com.Tour.service;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import java.util.Set;

public class ApplicationConstraintViolationException extends ConstraintViolationException {
    public ApplicationConstraintViolationException(String message, Set<? extends ConstraintViolation<?>> constraintViolations) {
        super(message, constraintViolations);
    }
}
