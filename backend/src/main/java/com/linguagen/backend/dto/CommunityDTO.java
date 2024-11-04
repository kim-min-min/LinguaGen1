package com.linguagen.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDTO {
    private Long idx;
    private String userId;
    private String category;
    private String title;
    private String content;
    private String file;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int viewCount;
    private int likeCount;
    private boolean isDeleted;
    private String nickname;
    private Long commentsCount;

    public CommunityDTO(Long idx, String title, String content, Long commentsCount) {
        this.idx = idx;
        this.title = title;
        this.content = content;
        this.commentsCount = commentsCount;
    }
}
