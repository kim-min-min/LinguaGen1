package com.linguagen.service;

import com.linguagen.dto.CommentDTO;
import com.linguagen.entity.Comment;
import com.linguagen.entity.Community;
import com.linguagen.entity.User;
import com.linguagen.repository.CommentRepository;
import com.linguagen.repository.CommunityRepository;
import com.linguagen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository repository;
    @Autowired
    private CommunityRepository communityRepository;
    @Autowired
    private UserRepository userRepository;

    //댓글 목록 조회
    public List<CommentDTO> getCommentsByCommunityIdx(Long communityIdx) {
        // communityIdx에 해당하는 삭제되지 않은(isDeleted = false) 댓글 목록을 조회
        List<Comment> comments = repository.findByCommunityIdxAndIsDeletedFalse(communityIdx);
        return comments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // 댓글 작성
    public CommentDTO addComment(CommentDTO commentDTO) {
        // userId와 communityIdx로 각각 User와 Community 엔티티를 조회
        User user = userRepository.findById(commentDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        Community community = communityRepository.findById(commentDTO.getCommunityIdx())
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        Comment comment = new Comment(user, community, commentDTO.getContent());
        Comment savedComment = repository.save(comment);
        return convertToDTO(savedComment);
    }

    // 댓글 삭제
    public void deleteComment(Long commentIdx) {
        Comment comment = repository.findById(commentIdx).orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        comment.setDeleted(true);
        repository.save(comment);
    }

    // Comment 엔티티를 CommentDTO로 변환하는 메서드
    private CommentDTO convertToDTO(Comment comment) {
        return new CommentDTO(
                comment.getIdx(),
                comment.getUser().getId(),
                comment.getCommunity().getIdx(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.isDeleted(),
                comment.getUser().getNickname()
        );
    }
}