package com.linguagen.dto;

import lombok.Getter;
import lombok.Setter;

public class GuessRequestDto {

    @Getter
    @Setter
    private String guess;

    @Getter
    @Setter
    private int attemptNumber;
}
