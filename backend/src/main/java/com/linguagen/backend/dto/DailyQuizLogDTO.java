package com.linguagen.backend.dto;

import com.linguagen.backend.entity.DailyQuizLog;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DailyQuizLogDTO {
    private String userId;
    private Long dailyQuizIdx;
    private int isCorrect;
    private int attemptCount;
    private int recentStreak;
    private int maxStreak;
    private LocalDateTime createdAt;

    public DailyQuizLogDTO() {
    }

    public DailyQuizLogDTO(DailyQuizLog log) {
        this.userId = log.getUser().getId();
        this.dailyQuizIdx = log.getDailyQuiz().getId();
        this.isCorrect = log.getIsCorrect();
        this.attemptCount = log.getAttemptCount();
        this.recentStreak = log.getRecentStreak();
        this.maxStreak = log.getMaxStreak();
        this.createdAt = log.getCreatedAt();
    }
}
