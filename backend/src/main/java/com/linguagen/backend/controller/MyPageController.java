package com.linguagen.backend.controller;


import com.linguagen.backend.dto.MyPageDTO;
import com.linguagen.backend.dto.QuestionDTO;
import com.linguagen.backend.service.StudentAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mypage-summary")
public class MyPageController {
    private final StudentAnswerService studentAnswerService;

    @Autowired
    public MyPageController(StudentAnswerService studentAnswerService) {
        this.studentAnswerService = studentAnswerService;
    }

    // 특정 studentId에 대한 데이터 반환
    @GetMapping("/{studentId}")
    public ResponseEntity<List<MyPageDTO>> getMypageSummaries(@PathVariable("studentId") String studentId) {
        List<MyPageDTO> myPageSummaries = studentAnswerService.getMyPageSummaries(studentId);
        return ResponseEntity.ok(myPageSummaries);
    }

    @GetMapping("/question/{studentId}")
    public ResponseEntity<List<QuestionDTO>> getFirstQuestionBySession(@PathVariable("studentId") String studentId) {
        List<QuestionDTO> questionSummaries = studentAnswerService.getFirstQuestionBySession(studentId);
        return ResponseEntity.ok(questionSummaries);
    }

}

