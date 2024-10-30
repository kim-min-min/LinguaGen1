package com.linguagen.backend.repository;

import com.linguagen.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.choices")
    List<Question> findAllWithChoices();

    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.choices WHERE q.type = :type")
    List<Question> findByTypeWithChoices(@Param("type") String type);

    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.choices " +
        "WHERE q.diffGrade = :grade AND q.diffTier = :tier")
    List<Question> findByDiffGradeAndDiffTierWithChoices(
        @Param("grade") Byte grade,
        @Param("tier") Byte tier);

    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.choices WHERE q.interest = :interest")
    List<Question> findByInterestWithChoices(@Param("interest") String interest);

    @Query(value = "SELECT * FROM question ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Question> findRandomQuestions(@Param("count") int count);

    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.choices WHERE q.idx = :idx")
    Optional<Question> findByIdWithChoices(@Param("idx") Long idx);

    // 특정 난이도의 랜덤 문제를 count개 만큼 가져오는 쿼리
    @Query(value = "SELECT * FROM question WHERE diff_grade = :grade AND diff_tier = :tier ORDER BY RAND() LIMIT :count",
        nativeQuery = true)
    List<Question> findRandomQuestionsByDifficulty(
        @Param("grade") Byte grade,
        @Param("tier") Byte tier,
        @Param("count") int count
    );
}
