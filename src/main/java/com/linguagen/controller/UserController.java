package com.linguagen.controller;

import com.linguagen.entity.USERS;
import com.linguagen.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")  // React와 CORS 문제 해결
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 생성자 주입
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 모든 유저 조회
    @GetMapping
    public ResponseEntity<List<USERS>> getAllUsers() {
        List<USERS> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // ID로 유저 조회
    @GetMapping("/{id}")
    public ResponseEntity<USERS> getUserById(@PathVariable String id) {
        USERS user = userService.getUserById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 유저 생성 또는 업데이트
    @PostMapping
    public ResponseEntity<USERS> saveOrUpdateUser(@RequestBody USERS user) {
        USERS savedUser = userService.saveOrUpdateUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // 유저 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // 로그인
    @PostMapping("/login")
    public String login(@RequestBody USERS user, HttpSession session) {
        boolean isAuthenticated = userService.login(user, session);
        if (isAuthenticated) {
            return "로그인 성공";
        } else {
            return "로그인 실패: 잘못된 자격 증명";
        }
    }

    // 로그아웃 요청 처리
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        userService.logout(session);
        return "로그아웃 되었습니다.";
    }
}
