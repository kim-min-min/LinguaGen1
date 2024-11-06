package com.linguagen.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class QuestionParsingException extends RuntimeException {
    public QuestionParsingException(String message) {
        super(message);
    }

    public QuestionParsingException(String message, Throwable cause) {
        super(message, cause);
    }
}