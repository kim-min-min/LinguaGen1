package com.linguagen.backend.service;

import com.linguagen.backend.entity.PointLog;
import com.linguagen.backend.entity.User;
import com.linguagen.backend.repository.PointLogRepository;
import com.linguagen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FatigueService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PointLogRepository pointLogRepository;

    // 피로도 증가 메서드
    public boolean increaseFatigue(String userId, int increaseAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String plan = "pro";
        int newFatigue = user.getFatigue() + increaseAmount;

        // 프로 사용자가 아니라면 최대 피로도를 100으로 제한
        if (!plan.equals(user.getPlan())) {
            newFatigue = Math.min(newFatigue, 100);
        }

        user.setFatigue(newFatigue);
        userRepository.save(user);

        // 프로 플랜이거나 피로도가 100 이하일 때 true 반환
        if (plan.equals(user.getPlan()) || newFatigue <= 100) {
            return true; // 게임 실행 가능
        } else {
            return false; // 피로도 100 이상일 때 "프로"가 아닌 경우 게임 실행 불가
        }
    }

    // 피로도 감소 메서드
    public boolean decreaseFatigue(String userId, int decreaseAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int newFatigue = user.getFatigue() - decreaseAmount;
        newFatigue = Math.max(newFatigue, 0); // 피로도는 최소 0으로 제한

        user.setFatigue(newFatigue);
        userRepository.save(user);

        return true; // 감소가 성공적으로 완료되면 true 반환
    }

    // 자정에 피로도 초기화 스케줄러
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정 실행
    public void resetFatigue() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.setFatigue(0);
        }
        userRepository.saveAll(users);
    }

    // 포인트 소모로 피로도 회복
    public int recoverFatigue(String userId, int recoveryAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int pointsNeeded = (recoveryAmount / 10) * 100;

        if (user.getPoints() < pointsNeeded) {
            throw new RuntimeException("Insufficient points");
        }

        // 포인트 차감 및 피로도 회복
        int newBalance = user.getPoints() - pointsNeeded;
        user.setPoints(newBalance);
        user.setFatigue(Math.max(user.getFatigue() - recoveryAmount, 0));
        userRepository.save(user);

        // 포인트 로그 기록
        PointLog pointLog = new PointLog();
        pointLog.setUser(user);
        pointLog.setChangeType("피로도 회복");
        pointLog.setChangeAmount(-pointsNeeded); // 음수로 기록하여 포인트가 차감된 것을 표시
        pointLog.setNewBalance(newBalance);
        pointLogRepository.save(pointLog);

        return user.getPoints(); // 업데이트된 포인트 반환
    }
}