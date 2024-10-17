package com.linguagen.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name = "DAILY_QUIZ")
@Entity
public class DailyQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DAILY_QUIZ_SEQ")
    @SequenceGenerator(name = "DAILY_QUIZ_SEQ", sequenceName = "DAILY_QUIZ_SEQ", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String answer;

    @Column(nullable = false)
    private String hint;
}
