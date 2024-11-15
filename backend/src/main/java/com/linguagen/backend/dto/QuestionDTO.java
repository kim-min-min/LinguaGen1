package com.linguagen.backend.dto;

import com.linguagen.backend.entity.Question;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long idx;
    private String type;
    private String detailType;
    private String interest;
    private Byte diffGrade;
    private Byte diffTier;
    private Question.QuestionFormat questionFormat;
    private String passage;
    private String question;
    private String correctAnswer;
    private String explanation;
    private List<ChoicesDTO> choices;
    private String sessionIdentifier; // 추가된 필드

    @JsonIgnore
    private LocalDateTime createdAt;

    // 첫 번째 문제의 특정 필드만 초기화하는 생성자 추가
    public QuestionDTO(String sessionIdentifier, String type, Byte diffGrade, Byte diffTier) {
        this.sessionIdentifier = sessionIdentifier;
        this.type = type;
        this.diffGrade = diffGrade;
        this.diffTier = diffTier;
    }

    // 추가할 필드
    private String setId;
    private Integer questionOrder;
    private Integer totalQuestionsInSet; // 항상 15

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChoicesDTO {
        private Long idx;
        private String choiceLabel;
        private String choiceText;
    }
}
