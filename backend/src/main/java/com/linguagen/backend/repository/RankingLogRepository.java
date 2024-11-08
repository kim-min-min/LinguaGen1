package com.linguagen.backend.repository;

import com.linguagen.backend.entity.RankingLog;
import com.linguagen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RankingLogRepository extends JpaRepository<RankingLog, Long> {

    // 특정 등급의 주간 랭킹 로그를 최신순으로 조회 (grade가 0이면 전체 조회)
    @Query("SELECT rl FROM RankingLog rl " +
            "JOIN Grade g ON rl.user.id = g.userId " +
            "WHERE rl.type = 'weekly' " +
            "AND (:grade = 0 OR g.grade = :grade) " +  // grade가 0이면 전체 조회, 아니면 특정 등급 조회
            "ORDER BY g.grade DESC, g.tier ASC, g.exp DESC, rl.logDate DESC")
    List<RankingLog> findWeeklyRankingByGradeOrAll(int grade);

    // 특정 등급의 개인 랭킹 로그를 최신순으로 조회 (grade가 0이면 전체 조회)
    @Query("SELECT rl FROM RankingLog rl " +
            "JOIN Grade g ON rl.user.id = g.userId " +
            "WHERE rl.type = 'personal' " +
            "AND (:grade = 0 OR g.grade = :grade) " +  // grade가 0이면 전체 조회, 아니면 특정 등급 조회
            "ORDER BY g.grade DESC, g.tier ASC, g.exp DESC, rl.logDate DESC")
    List<RankingLog> findPersonalRankingByGradeOrAll(int grade);

    // 특정 날짜의 사용자와 타입에 따른 랭킹 로그 조회
    @Query("SELECT rl FROM RankingLog rl " +
            "WHERE rl.user = :user AND rl.type = :type " +
            "AND FUNCTION('DATE', rl.logDate) = :today")
    Optional<RankingLog> findByUserAndTypeAndLogDate(User user, String type, LocalDate today);
}
