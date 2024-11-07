package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RankingLogDTO {

    private Long idx;
    private String userId;
    private String nickName;
    private String type;
    private int gradeRank;
    private int overallRank;
    private LocalDateTime logDate;
    private int grade;
    private int tier;
    private int exp;

    public RankingLogDTO(Long idx, String userId, String nickName, String type, int gradeRank, int overallRank,
                         LocalDateTime logDate, Integer grade, Integer tier, Integer exp) {
        this.idx = idx;
        this.userId = userId;
        this.nickName = nickName;
        this.type = type;
        this.gradeRank = gradeRank;
        this.overallRank = overallRank;
        this.logDate = logDate;
        this.grade = grade;
        this.tier = tier;
        this.exp = exp;
    }
}
