package com.linguagen.backend.service;

import com.linguagen.backend.dto.DailyQuizLogDTO;
import com.linguagen.backend.entity.DailyQuiz;
import com.linguagen.backend.entity.DailyQuizLog;
import com.linguagen.backend.entity.User;
import com.linguagen.backend.repository.DailyQuizLogRepository;
import com.linguagen.backend.repository.DailyQuizRepository;
import com.linguagen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DailyQuizService {

    @Autowired
    private DailyQuizRepository repository;

    @Autowired
    private DailyQuizLogRepository dailyQuizLogRepository;

    @Autowired
    private UserRepository userRepository;

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

    public DailyQuizLog saveDailyQuizLog(DailyQuizLogDTO dto) {
        DailyQuizLog log = new DailyQuizLog();

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        DailyQuiz quiz = repository.findById(dto.getDailyQuizIdx())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 퀴즈입니다."));

        log.setUser(user);
        log.setDailyQuiz(quiz);
        log.setIsCorrect(dto.getIsCorrect());
        log.setAttemptCount(dto.getAttemptCount());

        // 최근 기록 가져오기
        DailyQuizLog lastLog = dailyQuizLogRepository.findTopByUser_IdOrderByCreatedAtDesc(dto.getUserId()).orElse(null);

        if (dto.getIsCorrect() == 1) { // 정답일 경우
            int newStreak = (lastLog != null ? lastLog.getRecentStreak() : 0) + 1;
            log.setRecentStreak(newStreak);
            log.setMaxStreak(lastLog != null ? Math.max(newStreak, lastLog.getMaxStreak()) : newStreak);
        } else { // 틀렸을 경우
            log.setRecentStreak(0);
            log.setMaxStreak(lastLog != null ? lastLog.getMaxStreak() : 0);
        }

        return dailyQuizLogRepository.save(log);
    }

    public List<DailyQuizLogDTO> getDailyQuizResult(String userId) {
        List<DailyQuizLog> logs = dailyQuizLogRepository.findAllByUserId(userId);
        return logs.stream()
                .map(DailyQuizLogDTO::new) // 엔티티를 DTO로 변환
                .collect(Collectors.toList());
    }
}