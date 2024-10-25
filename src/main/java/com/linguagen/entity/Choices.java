package com.linguagen.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "choices")
@Data
public class Choices {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx", nullable = false, columnDefinition = "int unsigned")
    private Long idx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qs_idx", nullable = false)
    private Question question;

    @Column(name = "choice_label", nullable = false, length = 1)
    private String choiceLabel;

    @Column(name = "choice_text", nullable = false, columnDefinition = "text")
    private String choiceText;

    // 무한 순환 참조 방지를 위한 toString 재정의
    @Override
    public String toString() {
        return "Choices(idx=" + idx +
            ", choiceLabel=" + choiceLabel +
            ", choiceText=" + choiceText + ")";
    }

    // equals와 hashCode는 idx만 사용하도록 재정의
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Choices)) return false;
        Choices choices = (Choices) o;
        return idx != null && idx.equals(choices.getIdx());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}