package com.linguagen.backend.service;

import com.linguagen.backend.dto.SessionStatus;
import com.linguagen.backend.dto.TimeoutSessionDTO;
import com.linguagen.backend.repository.StudentAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameSessionManager {
    private final StudentAnswerRepository studentAnswerRepository;
    private final Map<String, LocalDateTime> activeSessions = new ConcurrentHashMap<>();
    private static final long SESSION_TIMEOUT = 30 * 60 * 1000; // 30분

    @Transactional
    public String createSession(String userId) {
        String sessionId = userId + "_" + System.currentTimeMillis();
        activeSessions.put(sessionId, LocalDateTime.now());
        return sessionId;
    }

    @Transactional
    public TimeoutSessionDTO checkAndUpdateSession(String sessionId) {
        LocalDateTime sessionStart = activeSessions.get(sessionId);
        if (sessionStart == null) {
            return new TimeoutSessionDTO(sessionId, 0, 0, true);
        }

        if (isSessionTimedOut(sessionStart)) {
            completeTimedOutSession(sessionId);
            return new TimeoutSessionDTO(sessionId,
                getCompletedQuestions(sessionId),
                getCorrectCount(sessionId),
                true);
        }

        return new TimeoutSessionDTO(sessionId,
            getCompletedQuestions(sessionId),
            getCorrectCount(sessionId),
            false);
    }

    private boolean isSessionTimedOut(LocalDateTime sessionStart) {
        return LocalDateTime.now().minusMinutes(30).isAfter(sessionStart);
    }

    @Transactional
    public void completeTimedOutSession(String sessionId) {
        studentAnswerRepository.findBySessionIdentifierOrderByQuestionOrder(sessionId)
            .stream()
            .filter(answer -> answer.getIsCorrect() == 2)
            .forEach(answer -> {
                answer.setIsCorrect(0);
                answer.setFeedback("시간 초과로 인한 미응답");
                studentAnswerRepository.save(answer);
            });

        activeSessions.remove(sessionId);
    }

    private int getCompletedQuestions(String sessionId) {
        return (int) studentAnswerRepository.findBySessionIdentifierOrderByQuestionOrder(sessionId)
            .stream()
            .filter(a -> a.getIsCorrect() != 2)
            .count();
    }

    private int getCorrectCount(String sessionId) {
        return (int) studentAnswerRepository.countCorrectAnswersBySession(sessionId);
    }

    // 수정된 cleanupExpiredSessions 메서드
    @Scheduled(fixedRate = 60000) // 1분마다 실행
    @Transactional
    public void cleanupExpiredSessions() {
        final LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30);

        // 만료된 세션 ID들을 먼저 수집
        Set<String> expiredSessionIds = activeSessions.entrySet().stream()
            .filter(entry -> entry.getValue().isBefore(cutoff))
            .map(Map.Entry::getKey)
            .collect(Collectors.toSet());

        // 만료된 세션들을 처리
        for (String sessionId : expiredSessionIds) {
            completeTimedOutSession(sessionId);
        }
    }

    public boolean isSessionActive(String sessionId) {
        return activeSessions.containsKey(sessionId) &&
            !isSessionTimedOut(activeSessions.get(sessionId));
    }
}