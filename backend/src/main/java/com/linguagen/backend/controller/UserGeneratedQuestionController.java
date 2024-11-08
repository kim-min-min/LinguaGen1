package com.linguagen.backend.controller;

import com.linguagen.backend.dto.QuestionGenerationRequestDTO;
import com.linguagen.backend.dto.UserGeneratedQuestionDTO;
import com.linguagen.backend.enums.QuestionType;
import com.linguagen.backend.exception.UnauthorizedException;
import com.linguagen.backend.service.UserGeneratedQuestionService;
import com.linguagen.backend.util.SessionUtil;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-questions")
@Slf4j
@RequiredArgsConstructor
public class UserGeneratedQuestionController {
    private final UserGeneratedQuestionService userGeneratedQuestionService;
    private final SessionUtil sessionUtil;

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuestion(@RequestBody @Valid QuestionGenerationRequestDTO request, HttpSession session) {
        try {
            // 세션 디버깅 로그
            System.out.println("===== Session Debug =====");
            System.out.println("Session ID: " + session.getId());
            System.out.println("Session Creation Time: " + session.getCreationTime());
            System.out.println("Session attributes:");
            java.util.Collections.list(session.getAttributeNames()).forEach(name ->
                System.out.println("  " + name + ": " + session.getAttribute(name))
            );
            System.out.println("=======================");

            String userId = sessionUtil.getCurrentUserId();
            System.out.println("User ID from SessionUtil: " + userId);

            userGeneratedQuestionService.generateQuestion(request, userId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Questions generated successfully");
            response.put("count", String.valueOf(request.getCount()));

            return ResponseEntity.ok(response);
        } catch (UnauthorizedException e) {
            System.out.println("UnauthorizedException caught: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error generating questions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error generating questions: " + e.getMessage());
        }
    }

//    @PostMapping("/{questionIdx}/answer")
//    public ResponseEntity<?> submitAnswer(
//        @PathVariable Long questionIdx,
//        @RequestBody String answer) {
//        try {
//            String userId = sessionUtil.getCurrentUserId();
//            UserGeneratedQuestionAnswer saved =
//                answerService.saveStudentAnswer(questionIdx, userId, answer);
//            return ResponseEntity.ok(saved);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

    @GetMapping("/my-questions")
    public ResponseEntity<List<UserGeneratedQuestionDTO>> getMyQuestions() {
        try {
            String userId = sessionUtil.getCurrentUserId();
            List<UserGeneratedQuestionDTO> questions = userGeneratedQuestionService.getUserQuestions(userId);
            return ResponseEntity.ok(questions);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private void validateRequest(QuestionGenerationRequestDTO request) {
        // 등급 검증
        List<String> validGrades = List.of("브론즈", "실버", "골드", "플래티넘", "다이아", "챌린저");
        if (!validGrades.contains(request.getGrade())) {
            throw new IllegalArgumentException("Invalid grade: " + request.getGrade());
        }

        // 챌린저가 아닐 경우에만 티어 검증
        if (!"챌린저".equals(request.getGrade())) {
            if (request.getTier() == null) {
                throw new IllegalArgumentException("Tier is required for non-challenger grade");
            }
            if (request.getTier() < 1 || request.getTier() > 4) {
                throw new IllegalArgumentException("Invalid tier: " + request.getTier());
            }
        }

        // 문제 유형 검증
        QuestionType questionType = Arrays.stream(QuestionType.values())
            .filter(type -> type.getValue().equals(request.getQuestionType()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Invalid question type: " + request.getQuestionType()));

        // 세부 유형 검증
        if (!questionType.getDetailTypes().contains(request.getDetailType())) {
            throw new IllegalArgumentException("Invalid detail type: " + request.getDetailType());
        }
    }
}