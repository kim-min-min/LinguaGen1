package com.linguagen.backend.repository;


import com.linguagen.backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 기본적인 CRUD 기능 제공 (findById, save 등)
    // 사용자 아이디와 비밀번호로 사용자 조회
    Optional<User> findByIdAndPassword(String id, String password);

    // 결제 후 사용자 plan 변경
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.plan = :plan WHERE u.id = :userId")
    void updatePlan(@Param("userId") String userId, @Param("plan") String plan);

}