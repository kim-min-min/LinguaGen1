package com.linguagen.backend.service;

import com.linguagen.backend.dto.DailyPlayCountDto;
import com.linguagen.backend.dto.IncorrectTypePercentageDto;
import com.linguagen.backend.dto.LatestStudyInfoDto;
import com.linguagen.backend.entity.Question;
import com.linguagen.backend.entity.StudentAnswer;
import com.linguagen.backend.repository.StudentAnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashBoardService {

    private final StudentAnswerRepository studentAnswerRepository;

    @Autowired
    public DashBoardService(StudentAnswerRepository studentAnswerRepository) {
        this.studentAnswerRepository = studentAnswerRepository;
    }

    @Cacheable(value = "latestStudyInfo", key = "#studentId")
    public LatestStudyInfoDto getLatestStudyInfo(String studentId) {
        Optional<StudentAnswer> latestLogOpt = studentAnswerRepository.findTopByStudentIdOrderByCreatedAtDesc(studentId);
        if (latestLogOpt.isPresent()) {
            StudentAnswer latestLog = latestLogOpt.get();
            Question question = latestLog.getQuestion();
            return new LatestStudyInfoDto(
                    question.getType(),
                    question.getDiffGrade(),
                    question.getDiffTier()
            );
        }
        return null;
    }

    @Cacheable(value = "dailyPlayCounts", key = "#studentId")
    public List<DailyPlayCountDto> getDailyPlayCounts(String studentId) {
        return studentAnswerRepository.findDailyPlayCountsByStudentId(studentId);
    }

    @Cacheable(value = "gameCount", key = "#studentId")
    public Long getGameCountByStudentId(String studentId) {
        return studentAnswerRepository.getGameCountByStudentId(studentId);
    }

    @Cacheable(value = "correctRate", key = "#studentId")
    public Double getAverageCorrectRateByStudentId(String studentId) {
        return studentAnswerRepository.findAverageCorrectRateByStudentId(studentId);
    }

    @Cacheable(value = "weeklyStudyDays", key = "#studentId")
    public List<String> getStudyDaysThisWeekByStudentId(String studentId) {
        LocalDateTime startOfWeek = LocalDate.now().with(java.time.DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime endOfWeek = startOfWeek.plusDays(6).withHour(23).withMinute(59).withSecond(59);
        List<StudentAnswer> studyLogs = studentAnswerRepository.findByStudentIdAndCreatedAtBetween(studentId, startOfWeek, endOfWeek);
        return studyLogs.stream()
                .map(studyLog -> studyLog.getCreatedAt().getDayOfWeek().toString())
                .distinct()
                .collect(Collectors.toList());
    }

    @Cacheable(value = "incorrectTypes", key = "#studentId")
    public List<IncorrectTypePercentageDto> getIncorrectTypePercentage(String studentId) {
        List<IncorrectTypePercentageDto> incorrectTypeCounts = 
            studentAnswerRepository.findIncorrectDetailTypeCountsByStudentId(studentId);

        long totalIncorrect = incorrectTypeCounts.stream()
                .mapToLong(IncorrectTypePercentageDto::getIncorrectCount)
                .sum();

        return incorrectTypeCounts.stream()
                .peek(dto -> {
                    double rawPercentage = (dto.getIncorrectCount() / (double) totalIncorrect) * 100;
                    dto.setPercentage(Math.round(rawPercentage));
                })
                .collect(Collectors.toList());
    }

    @CacheEvict(value = {
        "latestStudyInfo", 
        "dailyPlayCounts", 
        "gameCount", 
        "correctRate", 
        "weeklyStudyDays", 
        "incorrectTypes"
    }, key = "#studentId")
    public void clearStudentCache(String studentId) {
        // 캐시 초기화만 수행
    }
}
