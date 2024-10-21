package com.linguagen.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Entity
@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 포함
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자
public class USERS {

    @Id
    @Column(length = 50, nullable = false)
    private String id; // 회원 아이디 (Primary Key)

    @Column(length = 100, nullable = false)
    private String password; // 비밀번호

    @Column(length = 50)
    private String nickname; // 닉네임 (NULL 허용)

    @Temporal(TemporalType.DATE)
    @Column()
    private Date birthDate; // 생년월일

    @Column(length = 1000)
    private String address; // 주소

    @Column(length = 13)
    private String tell; // 전화번호

    @Column(length = 255)
    private String objective; // 학습 목표

    @Column(length = 50)
    private String tempGrade; // 임시 등급

    @Column(length = 50)
    private String grade; // 등급 (NULL 허용)

    private Byte tier; // 티어 (TINYINT, NULL 허용)

    private Byte exp; // 경험치 (TINYINT, NULL 허용)

    private Integer points; // 포인트 (NULL 허용)

    @Temporal(TemporalType.TIMESTAMP)
    @Column()
    private Date joinDate; // 가입 일자

    // 엔티티 저장 전 현재 시간 설정
    @PrePersist
    protected void onCreate() {
        this.joinDate = new Date();
    }

}
