package com.linguagen.backend.controller;

import com.linguagen.backend.dto.DailyPlayCountDto;
import com.linguagen.backend.dto.LatestStudyInfoDto;
import com.linguagen.backend.service.DashBoardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/study-log")
public class DashBoardController {

    private final DashBoardService dashBoardService;

    public DashBoardController(DashBoardService dashBoardService) {
        this.dashBoardService = dashBoardService;
    }

    @GetMapping("/latest/{studentId}")  // 엔드포인트의 변수명 변경
    public ResponseEntity<LatestStudyInfoDto> getLatestStudyInfo(@PathVariable("studentId") String studentId) {
        LatestStudyInfoDto latestStudyInfo = dashBoardService.getLatestStudyInfo(studentId);
        if (latestStudyInfo != null) {
            return ResponseEntity.ok(latestStudyInfo);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/daily-plays/{studentId}")
    public ResponseEntity<List<DailyPlayCountDto>> getDailyPlayCounts(@PathVariable("studentId") String studentId) {
        List<DailyPlayCountDto> dailyPlayCounts = dashBoardService.getDailyPlayCounts(studentId);
        return ResponseEntity.ok(dailyPlayCounts);
    }
}