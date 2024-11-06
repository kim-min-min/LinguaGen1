package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncorrectTypePercentageDto {

    private String questionType;    // 문제 유형
    private long incorrectCount;    // 틀린 횟수
    private double percentage;      // 비율

    // 쿼리 결과를 매핑하기 위한 생성자
    public IncorrectTypePercentageDto(String questionType, long incorrectCount) {
        this.questionType = questionType;
        this.incorrectCount = incorrectCount;
    }
}