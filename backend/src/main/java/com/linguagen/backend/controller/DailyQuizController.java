package com.linguagen.backend.controller;

import com.linguagen.backend.dto.DailyQuizLogDTO;
import com.linguagen.backend.dto.GuessRequestDto;
import com.linguagen.backend.entity.DailyQuiz;
import com.linguagen.backend.entity.DailyQuizLog;
import com.linguagen.backend.service.DailyQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DailyQuizController {

    @Autowired
    private DailyQuizService service;

    @GetMapping("/daily-quiz")
    public ResponseEntity<DailyQuiz> getDailyQuiz() {
        DailyQuiz quiz = service.getDailyQuiz();
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/check-guess")
    public ResponseEntity<Map<String, Object>> checkGuess(@RequestBody GuessRequestDto request) {
        try {
            Map<String, Object> response = service.checkGuess(request.getGuess(), request.getAttemptNumber());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage(), "details", e.toString()));
        }
    }

    @PostMapping("/get-hint")
    public ResponseEntity<Map<String, Object>> getHint() {
        Map<String, Object> response = service.getHint();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/daily_quiz/sendResult")
    public ResponseEntity<String> saveQuizResult(@RequestBody DailyQuizLogDTO dto) {
        try {
            DailyQuizLog savedLog = service.saveDailyQuizLog(dto);
            return ResponseEntity.ok("게임 결과 저장 성공: 로그 ID = " + savedLog.getIdx());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("게임 결과 저장 실패: " + e.getMessage());
        }
    }

    @GetMapping("/daily_quiz/quizStats")
    public ResponseEntity<List<DailyQuizLogDTO>> getDailyQuizResult(@RequestParam String userId) {
        List<DailyQuizLogDTO> logs = service.getDailyQuizResult(userId);
        return ResponseEntity.ok(logs);
    }

}