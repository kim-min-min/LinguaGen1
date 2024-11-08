package com.linguagen.backend.service;

import com.linguagen.backend.dto.RankingLogDTO;
import com.linguagen.backend.entity.Grade;
import com.linguagen.backend.entity.RankingLog;
import com.linguagen.backend.entity.User;
import com.linguagen.backend.repository.GradeRepository;
import com.linguagen.backend.repository.RankingLogRepository;
import com.linguagen.backend.repository.StudentAnswerRepository;
import com.linguagen.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RankingLogService {

    @Autowired
    private RankingLogRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GradeRepository gradeRepository;
    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    // 서버 시작 시 주간 랭킹을 한 번 생성
    @PostConstruct
    public void initWeeklyRanking() {
        generateWeeklyRanking();
    }

    // 1. 주간 랭킹 생성 메서드 - 매주 월요일 자정에 실행
    @Scheduled(cron = "0 0 0 * * MON")
    public void generateWeeklyRanking() {

    }

    // 2. 개인 랭킹 생성 메서드 - 매일 자정에 실행
    @Scheduled(cron = "0 0 0 * * *")
    public void generatePersonalRanking() {
        List<Object[]> personalRankingData = gradeRepository.findUsersOrderedByGradeTierAndExp();

        int overallRank = 1;
        int currentGradeRank = 1;
        int previousGrade = -1;
        int previousTier = -1;
        int previousExp = -1;
        LocalDateTime previousUpdatedAt = null;

        for (Object[] data : personalRankingData) {
            String userId = (String) data[0];
            int grade = (int) data[1];
            int tier = (int) data[2];
            int exp = (int) data[3];
            LocalDateTime updatedAt = (LocalDateTime) data[4];

            if (grade != previousGrade) {
                currentGradeRank = 1; // 등급이 변경되면 rank 초기화
            } else if (tier != previousTier) {
                currentGradeRank++; // 같은 등급에서 티어가 다르면 rank 증가
            } else if (exp != previousExp) {
                currentGradeRank++; // 같은 등급, 티어에서 경험치가 다르면 rank 증가
            } else if (updatedAt.isAfter(previousUpdatedAt)) {
                currentGradeRank++; // 동일한 조건에서 updatedAt이 느린 경우 rank 증가
            }

            saveRankingLog(userId, "personal", currentGradeRank, overallRank);

            previousGrade = grade;
            previousTier = tier;
            previousExp = exp;
            previousUpdatedAt = updatedAt;
            overallRank++;
        }
    }

    // 3. 주간 랭킹 조회 메서드 (전체 및 특정 등급 사용자)
    public List<RankingLogDTO> getWeeklyRanking(int grade) {
        List<RankingLog> rankingLogs = repository.findWeeklyRankingByGradeOrAll(grade);

        return rankingLogs.stream()
                .map(log -> {
                    Optional<Grade> gradeEntity = gradeRepository.findByUserId(log.getUser().getId());

                    // Grade 정보가 있을 경우에만 설정
                    Integer gradeValue = gradeEntity.map(Grade::getGrade).orElse(null);
                    Integer tier = gradeEntity.map(Grade::getTier).orElse(null);
                    Integer exp = gradeEntity.map(Grade::getExp).orElse(null);

                    return new RankingLogDTO(
                            log.getIdx(),
                            log.getUser().getId(),
                            log.getUser().getNickname(),
                            log.getType(),
                            log.getGradeRank(),
                            log.getOverallRank(),
                            log.getLogDate(),
                            gradeValue,  // grade 정보 추가 (null일 수 있음)
                            tier,        // tier 정보 추가 (null일 수 있음)
                            exp          // exp 정보 추가 (null일 수 있음)
                    );
                })
                .collect(Collectors.toList());
    }

    // 4. 개인 랭킹 조회 메서드 (전체 및 특정 등급 사용자)
    public List<RankingLogDTO> getPersonalRanking(int grade) {
        return repository.findPersonalRankingByGradeOrAll(grade).stream()
                .map(log -> {
                    Optional<Grade> gradeEntity = gradeRepository.findByUserId(log.getUser().getId());

                    // Grade 정보가 있을 경우에만 설정
                    Integer gradeValue = gradeEntity.map(Grade::getGrade).orElse(null);
                    Integer tier = gradeEntity.map(Grade::getTier).orElse(null);
                    Integer exp = gradeEntity.map(Grade::getExp).orElse(null);

                    return new RankingLogDTO(
                            log.getIdx(),
                            log.getUser().getId(),
                            log.getUser().getNickname(),
                            log.getType(),
                            log.getGradeRank(),
                            log.getOverallRank(),
                            log.getLogDate(),
                            gradeValue,  // grade 정보 추가 (null일 수 있음)
                            tier,        // tier 정보 추가 (null일 수 있음)
                            exp          // exp 정보 추가 (null일 수 있음)
                    );
                })
                .collect(Collectors.toList());
    }

    // 랭킹 로그 저장 메서드
    private void saveRankingLog(String userId, String type, int gradeRank, int overallRank) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + userId));

        // 오늘 날짜를 LocalDate로 얻기
        LocalDate today = LocalDate.now();

        // 동일한 사용자와 타입에 대해 오늘 날짜의 로그가 있는지 확인
        Optional<RankingLog> existingLog = repository.findByUserAndTypeAndLogDate(user, type, today);

        if (existingLog.isEmpty()) {
            // 오늘 날짜의 로그가 없으면 새 로그 생성
            RankingLog rankingLog = new RankingLog();
            rankingLog.setUser(user);
            rankingLog.setType(type);
            rankingLog.setGradeRank(gradeRank);
            rankingLog.setOverallRank(overallRank);
            rankingLog.setLogDate(today.atStartOfDay());

            repository.save(rankingLog);
        }
    }
}