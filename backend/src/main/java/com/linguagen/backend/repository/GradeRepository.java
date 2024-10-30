package com.linguagen.backend.repository;

import com.linguagen.backend.dto.GradeDTO;
import com.linguagen.backend.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Integer> {

    @Query("SELECT new com.linguagen.backend.dto.GradeDTO(g.idx, g.userId, g.grade, g.tier, g.exp, g.updatedAt) " +
            "FROM Grade g WHERE g.userId = :userId")
    GradeDTO findGradeDTOByUserId(@Param("userId") String userId);

    Optional<Grade> findByUserId(String userId);

    // 네이티브 쿼리를 사용하여 등급별 랭킹 조회
    List<Grade> findAllByOrderByGradeAscExpDesc();
}