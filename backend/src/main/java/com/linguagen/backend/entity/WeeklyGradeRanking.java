package com.linguagen.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_grade_ranking")
@Data
public class WeeklyGradeRanking {

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
