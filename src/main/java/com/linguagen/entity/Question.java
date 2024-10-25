package com.linguagen.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Table(name = "question")
@Data
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx", nullable = false, columnDefinition = "int unsigned")
    private Long idx;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "detail_type", nullable = false, length = 50)
    private String detailType;

    @Column(name = "interest", nullable = false, length = 100)
    private String interest;

    @Column(name = "diff_grade", nullable = false)
    private Byte diffGrade;

    @Column(name = "diff_tier", nullable = false)
    private Byte diffTier;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_format", nullable = false)
    private QuestionFormat questionFormat;

    @Column(name = "passage", columnDefinition = "text")
    private String passage;

    @Column(name = "question", nullable = false, columnDefinition = "text")
    private String question;

    @Column(name = "correct_answer", nullable = false, columnDefinition = "text")
    private String correctAnswer;

    @Column(name = "explanation", nullable = false, columnDefinition = "text")
    private String explanation;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Getter
    public enum QuestionFormat {
        MULTIPLE_CHOICE("multiple-choice"),
        SHORT_ANSWER("short-answer");

        private final String value;

        QuestionFormat(String value) {
            this.value = value;
        }

    }
}

