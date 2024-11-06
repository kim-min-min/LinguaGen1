package com.linguagen.backend.repository;

import com.linguagen.backend.entity.UserGeneratedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserGeneratedQuestionRepository extends JpaRepository<UserGeneratedQuestion, Long> {

    // userId 필드를 User의 id로 참조하여 접근합니다
    @Query("SELECT q FROM UserGeneratedQuestion q " +
        "LEFT JOIN FETCH q.choices " +
        "WHERE q.userId.id = :userId")
    List<UserGeneratedQuestion> findByUserIdWithChoices(@Param("userId") String userId);

    @Query("SELECT MAX(q.idx) FROM UserGeneratedQuestion q")
    Long findLastQuestionIdx();
}
