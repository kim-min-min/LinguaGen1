package com.linguagen.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Choices> choices = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // 연관관계 편의 메서드
    public void addChoice(Choices choice) {
        choices.add(choice);
        choice.setQuestion(this);
    }

    public void removeChoice(Choices choice) {
        choices.remove(choice);
        choice.setQuestion(null);
    }

    // 무한 순환 참조 방지를 위한 toString 재정의
    @Override
    public String toString() {
        return "Question(idx=" + idx +
            ", type=" + type +
            ", detailType=" + detailType +
            ", interest=" + interest +
            ", diffGrade=" + diffGrade +
            ", diffTier=" + diffTier +
            ", questionFormat=" + questionFormat +
            ", question=" + question +
            ", correctAnswer=" + correctAnswer +
            ", createdAt=" + createdAt + ")";
    }

    // equals와 hashCode는 idx만 사용하도록 재정의
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Question)) return false;
        Question question = (Question) o;
        return idx != null && idx.equals(question.getIdx());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
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

