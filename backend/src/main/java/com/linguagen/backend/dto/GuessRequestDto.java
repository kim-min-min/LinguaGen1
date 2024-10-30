package com.linguagen.backend.dto;

import lombok.Data;

@Data
public class GuessRequestDto {
    private String guess;
    private int attemptNumber;
}