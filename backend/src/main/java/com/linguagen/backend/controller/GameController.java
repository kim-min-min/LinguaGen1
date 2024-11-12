package com.linguagen.backend.controller;

import com.linguagen.backend.service.FatigueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/game")
public class GameController {
    @Autowired
    private FatigueService fatigueService;

    // 게임 시작 시 피로도 5증가
    @PostMapping("/start")
    public ResponseEntity<?> startGame(@RequestParam String userId) {
        boolean canIncreaseFatigue = fatigueService.increaseFatigue(userId, 5);
        if (canIncreaseFatigue) {
            return ResponseEntity.ok("Game started");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Fatigue limit reached");
        }
    }

    // 게임 승리 시 피로도 5 추가 증가
    @PostMapping("/win")
    public ResponseEntity<?> winGame(@RequestParam String userId) {
        boolean canIncreaseFatigue = fatigueService.increaseFatigue(userId, 5);
        if (canIncreaseFatigue) {
            return ResponseEntity.ok("Game won");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Fatigue limit reached");
        }
    }
}
