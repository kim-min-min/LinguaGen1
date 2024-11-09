package com.linguagen.backend.controller;

import com.linguagen.backend.service.RankingLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class RankingLogTestController {

    private final RankingLogService rankingLogService;

    public RankingLogTestController(RankingLogService rankingLogService) {
        this.rankingLogService = rankingLogService;
    }

    // 개인 랭킹 생성 테스트 엔드포인트
    @GetMapping("/generatePersonalRanking")
    public String generatePersonalRanking() {
        rankingLogService.generatePersonalRanking();
        return "Personal ranking generated successfully.";
    }
}
