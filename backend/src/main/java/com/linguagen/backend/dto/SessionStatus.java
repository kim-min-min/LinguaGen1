package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class SessionStatus {
    private String sessionIdentifier;
    private Integer correctCount;
    private Integer totalQuestions;
    private Boolean completed;
    private List<AnswerStatus> answers;
}