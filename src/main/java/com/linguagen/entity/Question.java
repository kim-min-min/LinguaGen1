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
    private Long idx; // 문제 식별자

    @Column(name = "type", nullable = false, length = 50)
    private String type; // 문제 유형

    @Column(name = "detail_type", nullable = false, length = 50)
    private String detailType; // 세부 유형

    @Column(name = "interest", nullable = false, length = 100)
    private String interest; // 관심사

    @Column(name = "diff_grade", nullable = false)
    private Byte diffGrade; // 난이도 등급

    @Column(name = "diff_tier", nullable = false)
    private Byte diffTier; // 난이도 티어

    @Enumerated(EnumType.STRING)
    @Column(name = "question_format", nullable = false)
    private QuestionFormat questionFormat; // 문제 형식

    @Column(name = "passage", columnDefinition = "text")
    private String passage; // 지문

    @Column(name = "question", nullable = false, columnDefinition = "text")
    private String question; // 질문 문항

    @Column(name = "correct_answer", nullable = false, columnDefinition = "text")
    private String correctAnswer; // 정답

    @Column(name = "explanation", nullable = false, columnDefinition = "text")
    private String explanation; // 해설

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 등록 일자

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

