package com.linguagen.backend.controller;

import com.linguagen.backend.scheduler.QuestionGenerationSchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/scheduler")
@RequiredArgsConstructor
@Slf4j
public class SchedulerController {
    private final QuestionGenerationSchedulerService schedulerService;

    @PostMapping("/generate-sample")
    public ResponseEntity<String> generateSample() {
        try {
            schedulerService.generateSampleQuestion();
            return ResponseEntity.ok("Sample question generation triggered successfully");
        } catch (Exception e) {
            log.error("Error triggering sample question generation", e);
            return ResponseEntity.internalServerError()
                .body("Failed to generate sample question: " + e.getMessage());
        }
    }
}