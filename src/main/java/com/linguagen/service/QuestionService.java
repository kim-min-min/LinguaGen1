package com.linguagen.service;

import com.linguagen.entity.Question;
import com.linguagen.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service  // 이 클래스가 Spring의 Service로 등록됨
public class QuestionService {

    private final QuestionRepository repository;

    // 생성자 주입 방식
    public QuestionService(QuestionRepository repository) {
        this.repository = repository;
    }

    // 모든 Question 리스트를 반환
    public Question list() {
        List<Question> questions = repository.findAll();
        if (!questions.isEmpty()) {
            return questions.get(0);
        } else {
            // 데이터가 없을 경우 null 반환
            return null;
        }
    }
}
