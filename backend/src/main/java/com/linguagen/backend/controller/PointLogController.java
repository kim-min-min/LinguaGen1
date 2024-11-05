package com.linguagen.backend.controller;

import com.linguagen.backend.dto.PointLogDTO;
import com.linguagen.backend.service.PointLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/points")
public class PointLogController {

    @Autowired
    private PointLogService service;

    // 포인트 로그 조회
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<PointLogDTO>> getUserPointHistory(@PathVariable("userId") String userId) {
        try {
            List<PointLogDTO> pointHistory = service.getPointLogByUserId(userId);
            return ResponseEntity.ok(pointHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
