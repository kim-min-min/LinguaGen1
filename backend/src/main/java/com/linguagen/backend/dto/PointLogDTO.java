package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointLogDTO {

    private String userId;
    private String changeType;
    private int changeAmount;
    private int newBalance;
    private LocalDateTime createdAt;
}
