package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnswerStatus {
    private Integer questionOrder;
    private Integer isCorrect;
}