package com.linguagen.backend.controller;

import com.linguagen.backend.service.FatigueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/game")
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

    // 포인트로 피로도 회복
    @PostMapping("/recoverFatigue")
    public ResponseEntity<Map<String, Integer>> recoverFatigue(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        int recoveryAmount = (int) payload.get("recoveryAmount");

        // 포인트 차감 및 피로도 회복 로직
        int updatedPoints = fatigueService.recoverFatigue(userId, recoveryAmount);

        // 클라이언트에 최신 포인트 반환
        Map<String, Integer> response = new HashMap<>();
        response.put("updatedPoints", updatedPoints);
        return ResponseEntity.ok(response);
    }
}
