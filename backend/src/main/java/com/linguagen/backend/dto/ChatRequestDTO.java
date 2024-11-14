package com.linguagen.backend.dto;

import lombok.Data;

@Data
public class ChatRequestDTO {
    private String roomId;
    private String message;
    private String studentId;
    private boolean includeAnalysis;

}
