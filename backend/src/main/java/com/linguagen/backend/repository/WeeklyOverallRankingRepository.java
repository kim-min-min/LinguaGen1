package com.linguagen.backend.repository;

import com.linguagen.backend.entity.WeeklyOverallRanking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeeklyOverallRankingRepository extends JpaRepository<WeeklyOverallRanking, String> {
    List<WeeklyOverallRanking> findTop10ByOrderByCorrectAnswersDescFirstCorrectDateAsc();
}
