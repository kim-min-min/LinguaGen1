package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimeoutSessionDTO {
    private String sessionIdentifier;
    private Integer completedQuestions;
    private Integer correctCount;
    private Boolean timeExpired;
}
