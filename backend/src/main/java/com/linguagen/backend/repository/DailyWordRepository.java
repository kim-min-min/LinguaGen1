package com.linguagen.backend.repository;


import com.linguagen.backend.entity.DailyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyWordRepository extends JpaRepository<DailyWord, Long> {

}
