package com.linguagen.backend.dto;

import java.time.LocalDate;

public class MyPageDTO {
    private String sessionIdentifier;
    private LocalDate createdAt;
    private Long count;
    private Long correctCount;
    private Long scoreSum;

    // 생성자 (java.sql.Date를 지원하는 생성자 추가)
    public MyPageDTO(String sessionIdentifier, java.sql.Date createdAt, Long count, Long correctCount, Long scoreSum) {
        this.sessionIdentifier = sessionIdentifier;
        this.createdAt = createdAt.toLocalDate(); // LocalDate로 변환
        this.count = count;
        this.correctCount = correctCount;
        this.scoreSum = scoreSum;
    }

    // Getter 및 Setter
    public String getSessionIdentifier() {
        return sessionIdentifier;
    }

    public void setSessionIdentifier(String sessionIdentifier) {
        this.sessionIdentifier = sessionIdentifier;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public Long getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(Long correctCount) {
        this.correctCount = correctCount;
    }

    public Long getScoreSum() {
        return scoreSum;
    }

    public void setScoreSum(Long scoreSum) {
        this.scoreSum = scoreSum;
    }
}
