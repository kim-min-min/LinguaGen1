package com.linguagen.backend.repository;

import com.linguagen.backend.entity.DailyQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyQuizRepository extends JpaRepository<DailyQuiz, Long> {
}