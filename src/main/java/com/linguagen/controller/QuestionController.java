package com.linguagen.controller;

import com.linguagen.entity.Question;
import com.linguagen.service.QuestionService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:5173")  // React와 CORS 문제 해결
@RestController
@RequestMapping("/api")
public class QuestionController {

    private final QuestionService service;

    // 생성자 주입을 통해 QuestionService 주입
    public QuestionController(QuestionService service) {
        this.service = service;
    }

    @GetMapping("/question")
    public Question question() {

        return service.list();
    }
}
