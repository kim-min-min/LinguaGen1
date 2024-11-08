package com.linguagen.backend.dto;

import com.linguagen.backend.entity.StudentAnswer;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnswerResponse {
    private Boolean isCorrect;
    private String feedback;
    private Boolean completed;
    private Integer correctCount;
    private Integer totalQuestions;

    public AnswerResponse(StudentAnswer answer, SessionStatus status) {
        this.isCorrect = answer.getIsCorrect() == 1;
        this.feedback = answer.getFeedback();
        this.completed = status.getCompleted();
        this.correctCount = status.getCorrectCount();
        this.totalQuestions = status.getTotalQuestions();
    }
}