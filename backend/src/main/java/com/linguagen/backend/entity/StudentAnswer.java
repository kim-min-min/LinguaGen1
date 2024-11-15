package com.linguagen.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_answers")
@Data
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id", nullable = false)
    private Long answerId;

    @ManyToOne
    @JoinColumn(name = "idx", nullable = false)
    private Question question;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "session_identifier", nullable = false)
    private String sessionIdentifier;

    @Column(name = "student_answer", nullable = false)
    private String studentAnswer;

    @Column(name = "is_correct")
    private Integer isCorrect = 2;  // 2: 미응답, 1: 정답, 0: 오답

    @Column(name = "feedback")
    private String feedback;

    @Column(name = "question_order", nullable = false)
    private Integer questionOrder;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "score")
    private Integer score;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
