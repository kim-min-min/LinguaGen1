package com.linguagen.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "access_log")
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "type", nullable = false, length = 10)
    private String type;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public AccessLog(String userId, String type) {
        this.userId = userId;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }
}
