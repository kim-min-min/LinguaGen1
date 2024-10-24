package com.linguagen.repository;

import com.linguagen.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    // 제목에 특정 문자열이 포함된 게시글 검색
    List<Community> findByTitleContaining(String title);

    // 글 작성자 기준(유저 아이디)으로 게시글 검색
    List<Community> findByUserId(String userId);

    // 글 작성자 기준(닉네임)으로 게시글 검색
    @Query("SELECT c FROM Community c WHERE c.user.nickname LIKE %:nickname%")
    List<Community> findByUserNicknameContaining(@Param("nickname") String nickname);

    // 카테고리별로 최신 글 4개 가져오기
    List<Community> findTop4ByCategoryOrderByCreatedAtDesc(String category);
}
