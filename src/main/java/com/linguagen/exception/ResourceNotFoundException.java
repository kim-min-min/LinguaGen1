package com.linguagen.exception;

// ResourceNotFoundException 정의
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
