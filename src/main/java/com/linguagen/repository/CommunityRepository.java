package com.linguagen.repository;

import com.linguagen.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    // 제목에 특정 문자열이 포함된 게시글 검색
    List<Community> findByTitleContaining(String title);

    // 글 작성자 기준으로 게시글 검색
    List<Community> findByUserId(String userId);
}
