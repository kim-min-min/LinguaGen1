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
import org.springframework.transaction.annotation.Transactional;

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

    // 서버 시작 시 개인 랭킹을 한 번 생성
    @PostConstruct
    public void initPersonalRanking() {
        generatePersonalRanking();
    }


    // 1. 주간 랭킹 생성 메서드 - 매주 월요일 자정에 실행
    @Scheduled(cron = "0 0 0 * * MON")
    public void generateWeeklyRanking() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> weeklyRankingData = studentAnswerRepository.findTopUsersByGradeAndCorrectAnswers(oneWeekAgo);

        int overallRank = 1;
        int currentGradeRank = 1;
        int previousGrade = -1;
        int previousCorrectAnswers = -1;
        LocalDateTime previousLogDate = null;

        for (Object[] data : weeklyRankingData) {
            String userId = (String) data[0];
            int grade = (int) data[1];
            int correctAnswers = ((Long) data[2]).intValue();
            LocalDateTime logDate = (LocalDateTime) data[3];

            // 등급이 같고 정답수가 같다면 시간 비교하여 순위 설정
            if (grade != previousGrade) {
                currentGradeRank = 1;
            } else if (correctAnswers != previousCorrectAnswers) {
                currentGradeRank++;
            } else if (logDate.isAfter(previousLogDate)) {
                currentGradeRank++;
            }

            saveRankingLog(userId, "weekly", currentGradeRank, overallRank);

            previousGrade = grade;
            previousCorrectAnswers = correctAnswers;
            previousLogDate = logDate;
            overallRank++;
        }
    }

    // 2. 개인 랭킹 생성 메서드 - 매일 자정에 실행
    @Scheduled(cron = "0 0 0 * * *")
    public void generatePersonalRanking() {
        // 개인 랭킹 데이터를 등급, 티어, 경험치, 기록 날짜 순서로 정렬하여 가져옴
        List<Object[]> personalRankingData = gradeRepository.findUsersOrderedByGradeTierAndExpWithLogDate();

        int overallRank = 1;
        int currentGradeRank = 1;
        int previousGrade = -1;
        int previousTier = -1;
        int previousExp = -1;
        LocalDateTime previousLogDate = null;

        for (Object[] data : personalRankingData) {
            String userId = (String) data[0];
            int grade = (int) data[1];
            int tier = (int) data[2];
            int exp = (int) data[3];
            LocalDateTime logDate = (LocalDateTime) data[4];

            // 동일 등급에서만 gradeRank 비교
            if (grade != previousGrade) {
                currentGradeRank = 1; // 등급이 변경되면 rank 초기화
            } else if (tier != previousTier) {
                currentGradeRank++; // 같은 등급에서 티어가 다르면 rank 증가
            } else if (exp != previousExp) {
                currentGradeRank++; // 같은 등급, 티어에서 경험치가 다르면 rank 증가
            } else if (logDate.isAfter(previousLogDate)) {
                currentGradeRank++; // 등급, 티어, 경험치가 같으면 logDate를 비교하여 늦은 사람이 낮은 등수
            }

            saveRankingLog(userId, "personal", currentGradeRank, overallRank);

            previousGrade = grade;
            previousTier = tier;
            previousExp = exp;
            previousLogDate = logDate;
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


    // 특정 등급별 순위를 계산하는 메서드 (주간 랭킹용)
    private int calculateGradeRankForWeekly(String userId, int grade, int correctAnswers, LocalDateTime logDate, List<Object[]> weeklyRankingData) {
        int gradeRank = 1;
        for (Object[] data : weeklyRankingData) {
            int otherGrade = (int) data[1];
            String otherUserId = (String) data[0];
            int otherCorrectAnswers = ((Long) data[2]).intValue();
            LocalDateTime otherLogDate = (LocalDateTime) data[3];

            if (otherUserId.equals(userId)) break;

            // 같은 등급일 때만 순위 비교
            if (otherGrade == grade) {
                if (otherCorrectAnswers > correctAnswers ||
                        (otherCorrectAnswers == correctAnswers && otherLogDate.isBefore(logDate))) {
                    gradeRank++;
                }
            }
        }
        return gradeRank;
    }

    // 개인 랭킹에서 특정 등급, 티어, 경험치별 순위를 계산하는 메서드
    private int calculateGradeRank(String userId, int grade, int tier, int exp, LocalDateTime logDate, List<Object[]> personalRankingData) {
        int gradeRank = 1;
        for (Object[] data : personalRankingData) {
            String otherUserId = (String) data[0];
            int otherGrade = (int) data[1];
            int otherTier = (int) data[2];
            int otherExp = (int) data[3];
            LocalDateTime otherLogDate = (LocalDateTime) data[4]; // logDate를 통한 우선순위 비교

            // 동일한 유저를 제외하고, 같은 grade 내에서 tier와 exp 비교
            if (!otherUserId.equals(userId) && otherGrade == grade) {
                // tier가 낮을수록 높은 순위
                if (otherTier < tier) {
                    gradeRank++;
                }
                // tier가 같을 때 exp가 더 높으면 순위 증가
                else if (otherTier == tier) {
                    if (otherExp > exp) {
                        gradeRank++;
                    }
                    // tier와 exp가 같을 때, logDate로 순위를 결정
                    else if (otherExp == exp && otherLogDate.isBefore(logDate)) {
                        gradeRank++;
                    }
                }
            }
        }
        return gradeRank;
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
            rankingLog.setLogDate(LocalDateTime.now());

            repository.save(rankingLog);
        }
    }
}