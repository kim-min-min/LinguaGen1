package com.linguagen.repository;

import com.linguagen.entity.USERS;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<USERS, String> {
    // 기본적인 CRUD 기능 제공 (findById, save 등)
    // 사용자 아이디와 비밀번호로 사용자 조회
    Optional<USERS> findByIdAndPassword(String id, String password);
}