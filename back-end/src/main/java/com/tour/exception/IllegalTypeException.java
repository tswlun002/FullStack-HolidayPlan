package com.tour.exception;

public class IllegalTypeException extends  IllegalArgumentException{

    /**
     * Constructs an {@code IllegalArgumentException} with the
     * specified detail message.
     *
     * @param s the detail message.
     */
    public IllegalTypeException(String s) {
        super(s);
    }
}
