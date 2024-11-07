package com.linguagen.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "ranking_log")
@Data
public class RankingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "type", nullable = false, length = 10)
    private String type;

    @Column(name = "grade_rank", nullable = false)
    private int gradeRank;

    @Column(name = "overall_rank", nullable = false)
    private int overallRank;

    @Column(name = "log_date", nullable = false)
    private LocalDateTime logDate;
}
