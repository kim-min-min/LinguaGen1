package com.linguagen.backend.controller;

import com.linguagen.backend.dto.AnswerResponse;
import com.linguagen.backend.dto.SessionStatus;
import com.linguagen.backend.entity.StudentAnswer;
import com.linguagen.backend.exception.SessionExpiredException;
import com.linguagen.backend.service.StudentAnswerService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
@Slf4j
public class StudentAnswerController {
    private final StudentAnswerService studentAnswerService;

    @PostMapping("/start-session")
    public ResponseEntity<Map<String, String>> startSession(@RequestBody Map<String, String> request) {
        String sessionId = studentAnswerService.startNewSession(request.get("userId"));
        return ResponseEntity.ok(Map.of("sessionIdentifier", sessionId));
    }

    @PostMapping("/submit")
    public ResponseEntity<AnswerResponse> submitAnswer(@RequestBody SubmitAnswerRequest request) {
        StudentAnswer savedAnswer = studentAnswerService.saveStudentAnswer(
            request.getSessionIdentifier(),
            request.getIdx(),
            request.getStudentId(),
            request.getStudentAnswer(),
            request.getQuestionOrder()
        );

        SessionStatus status = studentAnswerService.getSessionStatus(request.getSessionIdentifier());

        return ResponseEntity.ok(new AnswerResponse(savedAnswer, status));
    }

    @GetMapping("/session/{sessionIdentifier}/status")
    public ResponseEntity<SessionStatus> getSessionStatus(@PathVariable String sessionIdentifier) {
        return ResponseEntity.ok(studentAnswerService.getSessionStatus(sessionIdentifier));
    }

    @GetMapping("/active-session/{userId}")
    public ResponseEntity<Map<String, String>> getActiveSession(@PathVariable String userId) {
        return studentAnswerService.getActiveSession(userId)
            .map(sessionId -> ResponseEntity.ok(Map.of("sessionIdentifier", sessionId)))
            .orElseGet(() -> {
                // 활성 세션이 없으면 새 세션 시작
                String newSessionId = studentAnswerService.startNewSession(userId);
                return ResponseEntity.ok(Map.of("sessionIdentifier", newSessionId));
            });
    }

    // 추가할 엔드포인트
    @PostMapping("/session/{sessionIdentifier}/complete")
    public ResponseEntity<Void> completeSession(@PathVariable String sessionIdentifier) {
        studentAnswerService.completeSession(sessionIdentifier);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(SessionExpiredException.class)
    public ResponseEntity<ErrorResponse> handleSessionExpired(SessionExpiredException ex) {
        ErrorResponse response = new ErrorResponse(
            HttpStatus.REQUEST_TIMEOUT.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.REQUEST_TIMEOUT);
    }
}

@Data
class SubmitAnswerRequest {
    private String sessionIdentifier;
    private Long idx;
    private String studentId;
    private String studentAnswer;
    private Integer questionOrder;
}