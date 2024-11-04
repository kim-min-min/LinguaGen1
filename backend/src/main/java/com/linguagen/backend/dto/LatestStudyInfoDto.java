package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LatestStudyInfoDto {

    private String questionType;
    private byte difficultyGrade;
    private byte difficultyTier;

}