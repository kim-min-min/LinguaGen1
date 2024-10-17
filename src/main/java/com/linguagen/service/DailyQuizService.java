package com.linguagen.service;

import com.linguagen.entity.DailyQuiz;
import com.linguagen.repository.DailyQuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DailyQuizService {
    @Autowired
    private DailyQuizRepository repository;

    private DailyQuiz currentQuiz;

    public DailyQuiz getDailyQuiz() {
        currentQuiz = repository.findDailyQuiz();
        return currentQuiz;
    }

    public Map<String, Object> checkGuess(String guess, int attemptNumber) {
        if (currentQuiz == null) {
            currentQuiz = getDailyQuiz();
        }
        String answer = currentQuiz.getAnswer();
        String[] result = new String[answer.length()];
        boolean isCorrect = true;

        for (int i = 0; i < answer.length(); i++) {
            if (i < guess.length() && guess.charAt(i) == answer.charAt(i)) {
                result[i] = "correct";
            } else if (answer.indexOf(guess.charAt(i)) != -1) {
                result[i] = "present";
                isCorrect = false;
            } else {
                result[i] = "absent";
                isCorrect = false;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("isCorrect", isCorrect);
        response.put("attemptNumber", attemptNumber);
        return response;
    }

    public String getHint() {
        if (currentQuiz == null) {
            currentQuiz = getDailyQuiz();
        }
        return currentQuiz.getHint();
    }
}