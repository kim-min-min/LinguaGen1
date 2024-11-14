package com.linguagen.backend.repository;

import com.linguagen.backend.entity.UserGeneratedQuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGeneratedQuestionAnswerRepository extends JpaRepository<UserGeneratedQuestionAnswer, Long> {
    @Query("SELECT a FROM UserGeneratedQuestionAnswer a WHERE a.userId = :userId AND a.userGeneratedQuestion.idx IN :questionIds")
    List<UserGeneratedQuestionAnswer> findByUserIdAndQuestionIdxIn(@Param("userId") String userId, @Param("questionIds") List<Long> questionIds);
    
    @Query("SELECT a FROM UserGeneratedQuestionAnswer a WHERE a.userId = :userId AND a.userGeneratedQuestion.idx = :questionIdx")
    Optional<UserGeneratedQuestionAnswer> findByUserIdAndQuestionIdx(@Param("userId") String userId, @Param("questionIdx") Long questionIdx);
}
