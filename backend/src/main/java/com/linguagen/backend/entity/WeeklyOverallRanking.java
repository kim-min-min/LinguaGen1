package com.linguagen.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_overall_ranking")
@Data
public class WeeklyOverallRanking {

    @Id
    @Column(name = "idx")
    private Long idx;

    @Column(name = "userid")
    private String userId;

    @Column(name = "correct_answers")
    private int correctAnswers;

    @Column(name = "first_correct_date")
    private LocalDateTime firstCorrectDate;

    @Column(name = "last_correct_date")  // 마지막 문제 푼 날짜 필드 추가
    private LocalDateTime lastCorrectDate;

    @Column(name = "grade")
    private int grade; // 등급을 나타내는 필드
}