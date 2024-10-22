package com.linguagen.repository;

import com.linguagen.dto.GradeDTO;
import com.linguagen.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Integer> {

    @Query("SELECT new com.linguagen.dto.GradeDTO(g.idx, g.userId, g.grade, g.tier, g.exp, g.updatedAt) " +
            "FROM Grade g WHERE g.userId = :userId")
    GradeDTO findGradeDTOByUserId(@Param("userId") String userId);

    Optional<Grade> findByUserId(String userId);
}