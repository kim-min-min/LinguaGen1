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
    @Column( length = 255)
    private String id;

    @Column( length = 255)
    private String password;

    @Column( length = 255)
    private String phone;

    @Column(length = 100)
    private String nickname;

    @Temporal(TemporalType.DATE)
    @Column()
    private Date birthDate;

    @Column( length = 255)
    private String address;

    @Column(columnDefinition = "SET('Sports', 'Music')")
    private String interestSet;

    @Transient
    private List<String> interest;

    @Column(length = 50)
    private String tempGrade;

    @Column( length = 50)
    private String grade;

    private Integer tier;

    @Column()
    private Integer exp;

    @Column()
    private Integer points;

    @Column(length = 255)
    private String clubsId;

    @PostLoad
    private void postLoad() {
        if (interestSet != null && !interestSet.isEmpty()) {
            interest = Arrays.asList(interestSet.split(","));
        }
    }

    @PrePersist
    @PreUpdate
    private void prePersistOrUpdate() {
        if (interest != null && !interest.isEmpty()) {
            interestSet = String.join(",", interest);
        }
    }
}
