package com.linguagen.repository;

import com.linguagen.entity.DailyQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyQuizRepository extends JpaRepository<DailyQuiz, Long> {
}