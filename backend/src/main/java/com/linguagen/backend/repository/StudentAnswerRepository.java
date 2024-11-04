package com.linguagen.backend.repository;

import com.linguagen.backend.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    Optional<StudentAnswer> findTopByStudentIdOrderByCreatedAtDesc(String studentId);  // studentId를 사용
}


