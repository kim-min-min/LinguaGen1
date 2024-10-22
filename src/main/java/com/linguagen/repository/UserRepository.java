package com.linguagen.repository;


import com.linguagen.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // 기본적인 CRUD 기능 제공 (findById, save 등)
    // 사용자 아이디와 비밀번호로 사용자 조회
    Optional<User> findByIdAndPassword(String id, String password);


}