package com.linguagen.backend.repository;

import com.linguagen.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCommunityIdxAndIsDeletedFalse(Long communityIdx);
}
