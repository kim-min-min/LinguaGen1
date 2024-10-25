package com.linguagen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccessLogDTO {
    private String userId;
    private String type;
    private LocalDateTime createAt;
}
