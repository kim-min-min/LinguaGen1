package com.linguagen.backend.repository;


import com.linguagen.backend.entity.DailyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyWordRepository extends JpaRepository<DailyWord, Long> {

    @Query(value = "SELECT * FROM daily_word ORDER BY RAND() LIMIT 10", nativeQuery = true)
    List<DailyWord> findRandomWords();

}
