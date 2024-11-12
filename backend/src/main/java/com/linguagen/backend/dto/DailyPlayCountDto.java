package com.linguagen.backend.dto;

import java.time.LocalDate;

// DailyPlayCountDto.java
public class DailyPlayCountDto {
    private LocalDate date;
    private Long playCount;

    // 생성자 (sessionIdentifier 필드 제거)
    public DailyPlayCountDto(LocalDate date, Long playCount) {
        this.date = date;
        this.playCount = playCount;
    }

    // java.sql.Date를 지원하는 생성자 (필요 시)
    public DailyPlayCountDto(java.sql.Date date, Long playCount) {
        this.date = date.toLocalDate();
        this.playCount = playCount;
    }

    // Getter 및 Setter
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getPlayCount() {
        return playCount;
    }

    public void setPlayCount(Long playCount) {
        this.playCount = playCount;
    }
}
