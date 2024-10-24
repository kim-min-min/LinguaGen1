package com.linguagen.dto;



import java.util.List;



public class UserInterestDTO {
    private String userId;
    private List<String> interestIdx;

    // 기본 생성자
    public UserInterestDTO() {}

    // Getter와 Setter
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getInterestIdx() {
        return interestIdx;
    }

    public void setInterestIdx(List<String> interestIdx) {
        this.interestIdx = interestIdx;
    }
}
