package com.linguagen.backend.controller;

import com.linguagen.backend.dto.LearningAnalysisDTO;
import com.linguagen.backend.service.LearningAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning-analysis")
@RequiredArgsConstructor
public class LearningAnalysisController {
    private final LearningAnalysisService learningAnalysisService;
    
    @GetMapping("/{studentId}")
    public ResponseEntity<LearningAnalysisDTO> analyzeLearning(
        @PathVariable String studentId
    ) {
        LearningAnalysisDTO analysis = learningAnalysisService.analyzeLearning(studentId);
        return ResponseEntity.ok(analysis);
    }
} 