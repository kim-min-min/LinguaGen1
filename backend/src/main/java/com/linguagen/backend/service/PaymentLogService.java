package com.linguagen.backend.service;

import com.linguagen.backend.dto.PaymentLogDTO;
import com.linguagen.backend.entity.PaymentLog;
import com.linguagen.backend.entity.User;
import com.linguagen.backend.repository.PaymentLogRepository;
import com.linguagen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentLogService {

    @Autowired
    private PaymentLogRepository repository;

    @Autowired
    private UserRepository userRepository;

    // Entity -> DTO 변환 메서드
    public PaymentLogDTO toDto(PaymentLog paymentLog) {
        PaymentLogDTO dto = new PaymentLogDTO();
        dto.setIdx(paymentLog.getIdx());
        dto.setUserId(paymentLog.getUser().getId());
        dto.setAmount(paymentLog.getAmount());
        dto.setStatus(paymentLog.getStatus());
        dto.setTransactionId(paymentLog.getTransactionId());
        dto.setPaymentMethod(paymentLog.getPaymentMethod());
        dto.setCreatedAt(paymentLog.getCreatedAt());
        dto.setUpdatedAt(paymentLog.getUpdatedAt());
        return dto;
    }

    // DTO -> Entity 변환 메서드
    public PaymentLog toEntity(PaymentLogDTO dto, User user) {
        PaymentLog paymentLog = new PaymentLog();
        paymentLog.setUser(user);
        paymentLog.setAmount(dto.getAmount());
        paymentLog.setStatus(dto.getStatus());
        paymentLog.setTransactionId(dto.getTransactionId());
        paymentLog.setPaymentMethod(dto.getPaymentMethod());
        paymentLog.setCreatedAt(dto.getCreatedAt());
        paymentLog.setUpdatedAt(dto.getUpdatedAt());
        return paymentLog;
    }

    // 결제 기록 저장 메서드
    @Transactional
    public void logPayment(PaymentLogDTO paymentLogDTO) {
        User user = userRepository.findById(paymentLogDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자 ID입니다: " + paymentLogDTO.getUserId()));

        PaymentLog paymentLog = new PaymentLog();
        paymentLog.setUser(user);
        paymentLog.setAmount(paymentLogDTO.getAmount());
        paymentLog.setStatus(paymentLogDTO.getStatus());  // SUCCESS 또는 FAIL
        paymentLog.setTransactionId(paymentLogDTO.getTransactionId());
        paymentLog.setPaymentMethod(paymentLogDTO.getPaymentMethod());

        repository.save(paymentLog);
    }
}
