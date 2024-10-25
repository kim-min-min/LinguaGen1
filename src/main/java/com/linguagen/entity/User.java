package com.linguagen.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 포함
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자
public class User {

    @Id
    @Column(name = "id", nullable = false, length = 50)
    private String id;

    @Column(name = "pw", nullable = false, length = 100)
    private String password;

    @Column(name = "nickname", length = 50)
    private String nickname;

    @Column(name = "birth_date")
    private java.sql.Date birthDate;

    @Column(name = "address", nullable = false, length = 1000)
    private String address;

    @Column(name = "tell", nullable = false, length = 11)
    private String tell;

    @Column(name = "objective", length = 255)
    private String objective;

    @Column(name = "points", columnDefinition = "INT DEFAULT 0")
    private Integer points = 0;

    @Column(name = "join_date", nullable = false, updatable = false)
    private LocalDateTime joinDate;

    // 엔티티 저장 전 현재 시간 설정
    @PrePersist
    protected void onCreate() {
        this.joinDate = LocalDateTime.now();
    }

}
