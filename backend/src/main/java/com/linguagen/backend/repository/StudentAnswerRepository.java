package com.linguagen.backend.repository;

import com.linguagen.backend.dto.DailyPlayCountDto;
import com.linguagen.backend.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    Optional<StudentAnswer> findTopByStudentIdOrderByCreatedAtDesc(String studentId);  // studentId를 사용

    @Query("SELECT new com.linguagen.backend.dto.DailyPlayCountDto(DATE(s.createdAt), COUNT(s)) " +
            "FROM StudentAnswer s " +
            "WHERE s.studentId = :studentId " +
            "GROUP BY DATE(s.createdAt)")
    List<DailyPlayCountDto> findDailyPlayCountsByStudentId(@Param("studentId") String studentId);




}


