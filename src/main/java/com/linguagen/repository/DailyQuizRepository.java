package com.linguagen.repository;

import com.linguagen.entity.DailyQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DailyQuizRepository extends JpaRepository<DailyQuiz, Long> {
    @Query(value = "SELECT * FROM DAILY_QUIZ WHERE ID = (SELECT MOD(TO_NUMBER(TO_CHAR(SYSDATE, 'YYYYMMDD')), (SELECT COUNT(*) FROM DAILY_QUIZ)) + 1 FROM DUAL)", nativeQuery = true)
    DailyQuiz findDailyQuiz();
}
