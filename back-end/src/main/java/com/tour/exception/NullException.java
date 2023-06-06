package com.tour.exception;

public class NullException extends NullPointerException {
    /**
     * Constructs a {@code NullPointerException} with the specified
     * detail message.
     *
     * @param s the detail message.
     */
    public NullException(String s) {
        super(s);
    }
}
