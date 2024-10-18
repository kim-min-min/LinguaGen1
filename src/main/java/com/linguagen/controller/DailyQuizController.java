package com.linguagen.controller;

import com.linguagen.dto.GuessRequestDto;
import com.linguagen.entity.DailyQuiz;
import com.linguagen.service.DailyQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
        Map<String, Object> response = service.checkGuess(request.getGuess(), request.getAttemptNumber());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/get-hint")
    public ResponseEntity<Map<String, Object>> getHint() {
        Map<String, Object> response = new HashMap<>();
        response.put("hint", service.getHint());
        return ResponseEntity.ok(response);
    }
}