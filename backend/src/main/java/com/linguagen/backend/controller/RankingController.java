package com.linguagen.backend.controller;

import com.linguagen.backend.dto.RankingLogDTO;
import com.linguagen.backend.service.RankingLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    @Autowired
    private RankingLogService service;

    // 주간 랭킹 조회
    @GetMapping("/weekly")
    public List<RankingLogDTO> getWeeklyRanking(@RequestParam(name = "grade", required = false, defaultValue = "0") int grade) {
        return service.getWeeklyRanking(grade);
    }

    // 개인 랭킹 조회 (등급을 기준으로 필터링 가능)
    @GetMapping("/personal")
    public List<RankingLogDTO> getPersonalRanking(@RequestParam(name = "grade", required = false, defaultValue = "0") int grade) {
        return service.getPersonalRanking(grade);
    }


/*    // 단체 랭킹 조회
    @GetMapping("/group")
    public List<RankingLogDTO> getGroupRanking() {
        return service.getGroupRanking();
    }*/

}
