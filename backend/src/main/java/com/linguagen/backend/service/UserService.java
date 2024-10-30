package com.linguagen.backend.service;



import com.linguagen.backend.entity.User;
import com.linguagen.backend.repository.UserRepository;
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
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ID로 유저 조회
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    // 유저 생성 또는 업데이트
    @Transactional
    public User saveOrUpdateUser(User user) {
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
    public boolean login(User user, HttpSession session) {
        // DB에서 사용자를 조회
        Optional<User> optionalUser = userRepository.findByIdAndPassword(user.getId(), user.getPassword());

        if (optionalUser.isPresent()) {

            return true;
        }
        return false;
    }

    // 비번 변경
    @Transactional
    public boolean changePassword(String userId, String newPassword) {
        // ID가 String이므로 findById에 문자열로 전달
        User user = userRepository.findById(userId).orElseThrow(() ->
                new IllegalArgumentException("해당 사용자를 찾을 수 없습니다.")
        );

        user.setPassword(newPassword);  // 비밀번호 변경
        userRepository.save(user);  // 변경 사항 저장
        return true;
    }

    // 전번 변경
    @Transactional
    public boolean changeTellNumber(String id, String newTell) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setTell(newTell);  // 전화번호 업데이트
        userRepository.save(user);  // 변경 사항 저장
        return true;
    }

    // 로그아웃 로직: 세션 무효화
    public void logout(HttpSession session) {
        session.invalidate();  // 세션 무효화
    }





}