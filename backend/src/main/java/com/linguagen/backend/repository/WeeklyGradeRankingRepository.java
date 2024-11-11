package com.linguagen.backend.repository;

import com.linguagen.backend.entity.WeeklyGradeRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyGradeRankingRepository extends JpaRepository<WeeklyGradeRanking, Long> {
    List<WeeklyGradeRanking> findTop10ByOrderByGradeDescCorrectAnswersDescFirstCorrectDateAsc();
}
