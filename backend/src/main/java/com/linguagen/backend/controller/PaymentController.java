package com.linguagen.backend.controller;

import com.linguagen.backend.dto.PaymentLogDTO;
import com.linguagen.backend.service.PaymentLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/log")
public class PaymentController {

    @Autowired
    private PaymentLogService service;

/*    @PostMapping("/log")
    public ResponseEntity<String> logPayment(
            @RequestParam String userId,
            @RequestParam Double amount,
            @RequestParam String status,
            @RequestParam String transactionId,
            @RequestParam String paymentMethod) {

        PaymentLogDTO paymentLogDTO = new PaymentLogDTO();
        paymentLogDTO.setUserId(userId);
        paymentLogDTO.setAmount(amount);
        paymentLogDTO.setStatus(status);
        paymentLogDTO.setTransactionId(transactionId);
        paymentLogDTO.setPaymentMethod(paymentMethod);

        service.logPayment(paymentLogDTO);
        return ResponseEntity.ok("결제가 성공적으로 처리되었습니다.");
    }*/

    // 결제 성공 로그 기록 엔드포인트
    @PostMapping("/success")
    public ResponseEntity<String> logPaymentSuccess(@RequestBody PaymentLogDTO paymentLogDTO) {
        try {
            service.logPayment(paymentLogDTO);
            return ResponseEntity.ok("결제 성공 로그가 기록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 성공 로그 기록 중 오류가 발생했습니다.");
        }
    }

    // 결제 실패 로그 기록 엔드포인트
    @PostMapping("/fail")
    public ResponseEntity<String> logPaymentFail(@RequestBody PaymentLogDTO paymentLogDTO) {
        try {
            service.logPayment(paymentLogDTO);
            return ResponseEntity.ok("결제 실패 로그가 기록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 실패 로그 기록 중 오류가 발생했습니다.");
        }
    }

}
