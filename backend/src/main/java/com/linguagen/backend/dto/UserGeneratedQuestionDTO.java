package com.linguagen.backend.dto;

import com.linguagen.backend.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGeneratedQuestionDTO {
    private Long idx;
    private String userId;
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
    private List<ChoiceDTO> choices;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChoiceDTO {
        private Long idx;
        private String choiceLabel;
        private String choiceText;
    }
}