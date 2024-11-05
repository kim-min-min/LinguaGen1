package com.linguagen.backend.service;

import com.linguagen.backend.dto.PointLogDTO;
import com.linguagen.backend.entity.User;
import com.linguagen.backend.repository.PointLogRepository;
import com.linguagen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PointLogService {

    @Autowired
    private PointLogRepository repository;
    @Autowired
    private UserRepository userRepository;

    // 포인트 로그 가져오기
    public List<PointLogDTO> getPointLogByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // user 객체를 사용해 포인트 로그를 조회하고, DTO로 변환
        return repository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(pointLog -> new PointLogDTO(
                        pointLog.getUser().getId(),
                        pointLog.getChangeType(),
                        pointLog.getChangeAmount(),
                        pointLog.getNewBalance(),
                        pointLog.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
