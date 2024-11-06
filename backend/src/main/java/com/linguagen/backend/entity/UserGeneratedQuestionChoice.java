package com.linguagen.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_generated_question_choice")
@Data
public class UserGeneratedQuestionChoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx", nullable = false, columnDefinition = "int unsigned")
    private Long idx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qs_idx", nullable = false)
    private UserGeneratedQuestion userGeneratedQuestion;

    @Column(name = "choice_label", nullable = false, length = 1)
    private String choiceLabel;

    @Column(name = "choice_text", nullable = false, columnDefinition = "text")
    private String choiceText;

    @Override
    public String toString() {
        return "UserGeneratedQuestionChoice(idx=" + idx +
            ", choiceLabel=" + choiceLabel +
            ", choiceText=" + choiceText + ")";
    }
}