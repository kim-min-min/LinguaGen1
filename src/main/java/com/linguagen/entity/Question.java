package com.linguagen.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Question {
    @Id
    @Column(length = 255, nullable = false)
    private String id;  // 문제 ID

    @Column(length = 100, nullable = false)
    private String type;  // 문제 유형

    @Column(length = 100, nullable = false)
    private String detailedType;  // 세부 유형

    @Column(length = 100, nullable = false)
    private String interestCategory;  // 관심사

    @Column(length = 50, nullable = false)
    private String difficultyGrade;  // 난이도 등급

    @Column()
    private Integer difficultyTier;  // 난이도 티어

    @Column(length = 2000, nullable = false)
    private String content;  // 문제 내용

    @Column( length = 300, nullable = false)
    private String option1;  // 보기1

    @Column(length = 300)
    private String option2;  // 보기2

    @Column(length = 300)
    private String option3;  // 보기3

    @Column(length = 300)
    private String option4;  // 보기4

    @Column(length = 50, nullable = false)
    private String correctAnswer;  // 정답

    @Column(length = 2000)
    private String explanation;  // 문제 해설

    public Question() {}
}
