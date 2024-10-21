package com.linguagen.service;


import com.linguagen.entity.USERS;
import com.linguagen.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    // 생성자 주입
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 모든 유저 조회
    public List<USERS> getAllUsers() {
        return userRepository.findAll();
    }

    // ID로 유저 조회
    public USERS getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    // 유저 생성 또는 업데이트
    @Transactional
    public USERS saveOrUpdateUser(USERS user) {
        // 유효성 검사 예시
        if (user.getId() == null || user.getPassword() == null ) {
            throw new IllegalArgumentException("필수 필드가 누락되었습니다.");
        }

        // 중복 ID 검사
        if (userRepository.existsById(user.getId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        return userRepository.save(user);
    }

    // 유저 삭제
    @Transactional
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }



    // User 객체를 사용하여 로그인 처리
    public boolean login(USERS user, HttpSession session) {
        // DB에서 사용자를 조회
        Optional<USERS> optionalUser = userRepository.findByIdAndPassword(user.getId(), user.getPassword());

        if (optionalUser.isPresent()) {
            USERS authenticatedUser = optionalUser.get();

            // 세션에 로그인 정보 저장
            session.setAttribute("user", authenticatedUser.getId());
            session.setAttribute("grade", authenticatedUser.getGrade());
            session.setAttribute("nickname", authenticatedUser.getNickname());
            return true;
        }
        return false;
    }

    // 로그아웃 로직: 세션 무효화
    public void logout(HttpSession session) {
        session.invalidate();  // 세션 무효화
    }


    // 등급과 경험치로 정렬된 모든 사용자 목록 반환
    public List<USERS> getAllUsersByRanking() {
        return userRepository.findAllByOrderByGradeAscExpDesc();
    }


}
