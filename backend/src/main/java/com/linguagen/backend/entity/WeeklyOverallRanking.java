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

    @Column(name = "grade")
    private int grade; // 등급을 나타내는 필드
}