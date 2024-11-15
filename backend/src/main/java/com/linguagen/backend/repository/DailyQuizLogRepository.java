package com.linguagen.backend.repository;

import com.linguagen.backend.entity.DailyQuizLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DailyQuizLogRepository extends JpaRepository<DailyQuizLog, Long> {

    // 사용자 ID로 전체 기록 조회
    @Query("SELECT d FROM DailyQuizLog d WHERE d.user.id = :userId")
    List<DailyQuizLog> findAllByUserId(@Param("userId") String userId);

    // 사용자별 가장 최근 로그 조회
    Optional<DailyQuizLog> findTopByUser_IdOrderByCreatedAtDesc(String userId);
}
