package com.linguagen.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor // 모든 필드를 파라미터로 받는 생성자 추가
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
}
