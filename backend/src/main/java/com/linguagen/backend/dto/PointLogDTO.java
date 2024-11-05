package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointLogDTO {

    private String userId;
    private String changeType;
    private int changeAmount;
    private int newBalance;
}
