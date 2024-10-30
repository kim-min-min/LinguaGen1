package com.linguagen.backend.service;

import com.linguagen.backend.entity.DailyQuiz;
import com.linguagen.backend.repository.DailyQuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DailyQuizService {

    @Autowired
    private DailyQuizRepository repository;

    public DailyQuiz getDailyQuiz() {
        try {
            long count = repository.count();
            if (count == 0) {
                throw new IllegalStateException("데이터베이스에 퀴즈가 없습니다.");
            }
            long quizId = LocalDate.now().toEpochDay() % count + 1;
            return repository.findById(quizId)
                    .orElseThrow(() -> new IllegalStateException("오늘의 퀴즈를 찾을 수 없습니다."));
        } catch (Exception e) {
            throw new RuntimeException("퀴즈 조회 중 오류 발생: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> checkGuess(String guess, int attemptNumber) {
        guess = guess.toUpperCase();
        DailyQuiz dailyQuiz = getDailyQuiz();
        String answer = dailyQuiz.getAnswer().toUpperCase();

        String[] result = new String[5];
        for (int i = 0; i < 5; i++) {
            if (i < guess.length() && i < answer.length()) {
                if (guess.charAt(i) == answer.charAt(i)) {
                    result[i] = "correct";
                } else if (answer.contains(String.valueOf(guess.charAt(i)))) {
                    result[i] = "present";
                } else {
                    result[i] = "absent";
                }
            } else {
                result[i] = "absent";
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        return response;
    }

    public Map<String, Object> getHint() {
        DailyQuiz dailyQuiz = getDailyQuiz();
        Map<String, Object> response = new HashMap<>();
        response.put("hint", dailyQuiz.getHint());
        return response;
    }
}