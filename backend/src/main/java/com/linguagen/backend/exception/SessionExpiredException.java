package com.linguagen.backend.exception;

public class SessionExpiredException extends RuntimeException {
    public SessionExpiredException(String message) {
        super(message);
    }

    public SessionExpiredException(String message, Throwable cause) {
        super(message, cause);
    }
}