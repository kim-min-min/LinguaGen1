package com.linguagen.backend.service;

import com.linguagen.backend.dto.*;
import com.linguagen.backend.repository.StudentAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningAnalysisService {
    private final DashBoardService dashBoardService;
    private final StudentAnswerRepository studentAnswerRepository;

    public LearningAnalysisDTO analyzeLearning(String studentId) {
        // 기본 데이터 수집
        Long totalSessions = dashBoardService.getGameCountByStudentId(studentId);
        Double averageCorrectRate = dashBoardService.getAverageCorrectRateByStudentId(studentId);
        List<String> studyDays = dashBoardService.getStudyDaysThisWeekByStudentId(studentId);
        List<IncorrectTypePercentageDto> incorrectTypes = dashBoardService.getIncorrectTypePercentage(studentId);
        List<DailyPlayCountDto> dailyPlayCounts = dashBoardService.getDailyPlayCounts(studentId);
        LatestStudyInfoDto latestStudyInfo = dashBoardService.getLatestStudyInfo(studentId);

        // null 체크 및 기본값 설정
        totalSessions = totalSessions != null ? totalSessions : 0L;
        averageCorrectRate = averageCorrectRate != null ? averageCorrectRate : 0.0;
        studyDays = studyDays != null ? studyDays : new ArrayList<>();
        incorrectTypes = incorrectTypes != null ? incorrectTypes : new ArrayList<>();

        // 분석 수행
        String studyPattern = analyzeStudyPattern(studyDays, dailyPlayCounts);
        String recommendedLevel = determineRecommendedLevel(averageCorrectRate, totalSessions);
        List<String> weakPoints = analyzeWeakPoints(incorrectTypes, averageCorrectRate);

        // 오답 유형 퍼센티지 계산
        Map<String, Double> incorrectTypePercentages = calculateIncorrectTypePercentages(incorrectTypes);

        return LearningAnalysisDTO.builder()
            .studentId(studentId)
            .totalSessions(totalSessions.intValue())
            .averageCorrectRate(averageCorrectRate)
            .studyDays(formatStudyDays(studyDays))
            .incorrectTypePercentages(incorrectTypePercentages)
            .recommendedLevel(recommendedLevel)
            .weakPoints(weakPoints)
            .studyPattern(studyPattern)
            .weeklyStudyCount(studyDays.size())
            .dailyPlayCounts(dailyPlayCounts)
            .incorrectTypes(incorrectTypes)
            .currentDifficultyGrade(latestStudyInfo != null ? latestStudyInfo.getDifficultyGrade() : null)
            .currentDifficultyTier(latestStudyInfo != null ? latestStudyInfo.getDifficultyTier() : null)
            .build();
    }

    private String analyzeStudyPattern(List<String> studyDays, List<DailyPlayCountDto> dailyPlayCounts) {
        if (studyDays == null || studyDays.isEmpty()) {
            return "학습 기록 없음";
        }

        // 일일 학습량 분석
        double averageDailyPlays = dailyPlayCounts.stream()
            .mapToLong(DailyPlayCountDto::getPlayCount)
            .average()
            .orElse(0.0);

        if (studyDays.size() >= 5 && averageDailyPlays >= 3) {
            return "매우 성실한 학습 패턴";
        } else if (studyDays.size() >= 3 && averageDailyPlays >= 2) {
            return "규칙적인 학습 패턴";
        } else if (studyDays.size() >= 2) {
            return "기본적인 학습 패턴";
        } else {
            return "불규칙한 학습 패턴";
        }
    }

    private String determineRecommendedLevel(Double averageCorrectRate, Long totalSessions) {
        if (averageCorrectRate == null || totalSessions == null) {
            return "초급";
        }

        // 학습 횟수와 정답률을 모두 고려
        if (totalSessions >= 30 && averageCorrectRate >= 85) {
            return "상급";
        } else if (totalSessions >= 15 && averageCorrectRate >= 70) {
            return "중급";
        } else if (totalSessions >= 5 && averageCorrectRate >= 50) {
            return "초중급";
        } else {
            return "초급";
        }
    }

    private List<String> analyzeWeakPoints(List<IncorrectTypePercentageDto> incorrectTypes, Double averageCorrectRate) {
        List<String> weakPoints = new ArrayList<>();

        // 전반적인 성적이 낮은 경우
        if (averageCorrectRate < 50) {
            weakPoints.add("전반적인 기초 실력 향상 필요");
        }

        // 특정 유형별 취약점 분석 (30% 이상 오답률인 경우)
        incorrectTypes.stream()
            .filter(type -> type.getPercentage() > 30.0)
            .forEach(type -> {
                switch (type.getQuestionType().toLowerCase()) {
                    case "vocabulary" -> weakPoints.add("어휘력 부족");
                    case "grammar" -> weakPoints.add("문법 이해도 부족");
                    case "reading" -> weakPoints.add("독해력 부족");
                    case "listening" -> weakPoints.add("듣기 능력 부족");
                    default -> weakPoints.add(type.getQuestionType() + " 취약");
                }
            });

        return weakPoints;
    }

    private Map<String, Double> calculateIncorrectTypePercentages(List<IncorrectTypePercentageDto> incorrectTypes) {
        long totalIncorrect = incorrectTypes.stream()
            .mapToLong(IncorrectTypePercentageDto::getIncorrectCount)
            .sum();

        return incorrectTypes.stream()
            .collect(Collectors.toMap(
                IncorrectTypePercentageDto::getQuestionType,
                dto -> Math.round((dto.getIncorrectCount() / (double) totalIncorrect) * 100.0) / 100.0
            ));
    }

    private List<String> formatStudyDays(List<String> studyDays) {
        return studyDays.stream()
            .map(day -> day.substring(0, 1).toUpperCase() + day.substring(1).toLowerCase())
            .collect(Collectors.toList());
    }
}