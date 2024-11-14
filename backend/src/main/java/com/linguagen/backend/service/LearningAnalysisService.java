package com.linguagen.backend.service;

import com.linguagen.backend.dto.LearningAnalysisDTO;
import com.linguagen.backend.dto.IncorrectTypePercentageDto;
import com.linguagen.backend.repository.StudentAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningAnalysisService {
    private final DashBoardService dashBoardService;
    private final StudentAnswerRepository studentAnswerRepository;

    public LearningAnalysisDTO analyzeLearning(String studentId) {
        // 총 세션 수 조회
        Long totalSessions = dashBoardService.getGameCountByStudentId(studentId);
        // 평균 정답률 조회
        Double averageCorrectRate = dashBoardService.getAverageCorrectRateByStudentId(studentId);
        // 학습 요일 조회
        List<String> studyDays = dashBoardService.getStudyDaysThisWeekByStudentId(studentId);
        // 오답 유형 분석
        List<IncorrectTypePercentageDto> incorrectTypes = dashBoardService.getIncorrectTypePercentage(studentId);
        Map<String, Double> incorrectTypePercentages = incorrectTypes.stream()
            .collect(Collectors.toMap(
                IncorrectTypePercentageDto::getQuestionType,
                IncorrectTypePercentageDto::getPercentage
            ));

        // 학습 패턴 분석
        String studyPattern = analyzeStudyPattern(studyDays);

        // 추천 레벨 결정
        String recommendedLevel = determineRecommendedLevel(averageCorrectRate);

        // 취약점 분석
        List<String> weakPoints = analyzeWeakPoints(incorrectTypes);

        return LearningAnalysisDTO.builder()
            .studentId(studentId)
            .totalSessions(totalSessions.intValue())
            .averageCorrectRate(averageCorrectRate)
            .studyDays(studyDays)
            .incorrectTypePercentages(incorrectTypePercentages)
            .recommendedLevel(recommendedLevel)
            .weakPoints(weakPoints)
            .studyPattern(studyPattern)
            .weeklyStudyCount(studyDays.size())
            .build();
    }

    private String analyzeStudyPattern(List<String> studyDays) {
        if (studyDays.size() >= 5) {
            return "매우 성실한 학습 패턴";
        } else if (studyDays.size() >= 3) {
            return "규칙적인 학습 패턴";
        } else {
            return "불규칙한 학습 패턴";
        }
    }

    private String determineRecommendedLevel(Double averageCorrectRate) {
        if (averageCorrectRate == null) return "초급";

        if (averageCorrectRate >= 90) {
            return "상급";
        } else if (averageCorrectRate >= 70) {
            return "중급";
        } else {
            return "초급";
        }
    }

    private List<String> analyzeWeakPoints(List<IncorrectTypePercentageDto> incorrectTypes) {
        return incorrectTypes.stream()
            .filter(type -> type.getPercentage() > 30.0)
            .map(IncorrectTypePercentageDto::getQuestionType)
            .collect(Collectors.toList());
    }
}