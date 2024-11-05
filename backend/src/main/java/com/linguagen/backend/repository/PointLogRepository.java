package com.linguagen.backend.repository;

import com.linguagen.backend.entity.PointLog;
import com.linguagen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointLogRepository extends JpaRepository<PointLog, Long> {

    // 포인트 로그 가져오기
    List<PointLog> findByUserOrderByCreatedAtDesc(User user);
}
