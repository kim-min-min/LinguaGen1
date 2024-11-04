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

    public CommunityDTO(Long idx, String id, String category, String title, String content,
                        String file, LocalDateTime createdAt, LocalDateTime updatedAt,
                        int viewCount, int likeCount, boolean deleted, String nickname) {
        this.idx = idx;
        this.userId = id;
        this.category = category;
        this.title = title;
        this.content = content;
        this.file = file;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.isDeleted = deleted;
        this.nickname = nickname;
    }
}
