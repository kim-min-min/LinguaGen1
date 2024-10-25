package com.linguagen.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_interest")
public class UserInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;  // 고유 ID

    @Column(nullable = false)
    private String userId;  // 사용자 ID

    @Column(nullable = false)
    private String interestIdx;  // 관심사 ID

    // 기본 생성자 (필수)
    public UserInterest() {}

    // 모든 필드를 포함한 생성자
    public UserInterest(String userId, String interestIdx) {
        this.userId = userId;
        this.interestIdx = interestIdx;
    }

    // Getters and Setters
    public Long getId() {
        return idx;
    }

    public void setId(Long id) {
        this.idx = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getInterestIdx() {
        return interestIdx;
    }

    public void setInterestIdx(String interestIdx) {
        this.interestIdx = interestIdx;
    }
}
