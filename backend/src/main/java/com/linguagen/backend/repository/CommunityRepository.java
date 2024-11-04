package com.linguagen.backend.repository;

import com.linguagen.backend.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    // 삭제되지 않은 게시글만 조회
    List<Community> findByIsDeletedFalseOrderByCreatedAtDesc();

    // 특정 idx에 해당하는 삭제되지 않은 게시글만 조회
    Optional<Community> findByIdxAndIsDeletedFalse(Long idx);

    // 제목으로 검색하고 삭제되지 않은 게시글만 조회
    List<Community> findByTitleContainingAndIsDeletedFalse(String title);

    // 작성자 ID로 검색하고 삭제되지 않은 게시글만 조회
    List<Community> findByUserIdAndIsDeletedFalse(String userId);

    // 닉네임으로 검색하고 삭제되지 않은 게시글만 조회
    @Query("SELECT c FROM Community c WHERE c.user.nickname = :nickname AND c.isDeleted = false")
    List<Community> findByNicknameAndIsDeletedFalse(@Param("nickname") String nickname);

    // 특정 카테고리의 최신 4개 글, 삭제되지 않은 게시글만 조회
    List<Community> findTop4ByCategoryAndIsDeletedFalseOrderByCreatedAtDesc(String category);

    // 사용자 아이디로 게시글 조회
    Page<Community> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(String userId, Pageable pageable);
}
