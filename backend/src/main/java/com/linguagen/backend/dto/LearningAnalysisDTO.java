package com.linguagen.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LearningAnalysisDTO {
    private String studentId;
    private Integer totalSessions;
    private Double averageCorrectRate;
    private List<String> studyDays;
    private Map<String, Double> incorrectTypePercentages;
    private String recommendedLevel;
    private List<String> weakPoints;
    private String studyPattern;
    private Integer weeklyStudyCount;
} 