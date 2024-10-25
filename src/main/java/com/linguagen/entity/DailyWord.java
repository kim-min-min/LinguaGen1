package com.linguagen.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "daily_word")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx", nullable = false, updatable = false, columnDefinition = "INT UNSIGNED")
    private Long idx;

    @Column(name = "word", nullable = false)
    private String word;

    @Column(name = "word_desc", nullable = false)
    private String wordDesc;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
