package com.linguagen.backend.service;

import com.linguagen.backend.entity.AccessLog;
import com.linguagen.backend.repository.AccessLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccessLogService {

    @Autowired
    private AccessLogRepository repository;

    public void saveLog(String userId, String type) {
        try {
            AccessLog accessLog = new AccessLog(userId, type);
            repository.save(accessLog);
        } catch (Exception e) {
            // 예외 처리
            System.err.println("로그 저장 중 오류 발생: " + e.getMessage());
            e.printStackTrace();  // 서버 로그에 예외 스택 트레이스 출력
        }
    }

}
