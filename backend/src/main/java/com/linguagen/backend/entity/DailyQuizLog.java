package com.linguagen.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "daily_quiz_log")
public class DailyQuizLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "daily_quiz_idx", nullable = false)
    private DailyQuiz dailyQuiz;

    @Column(name = "is_correct", nullable = false)
    private int isCorrect;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "recent_streak", nullable = true)
    private int recentStreak;

    @Column(name = "max_streak", nullable = true)
    private int maxStreak;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

}
