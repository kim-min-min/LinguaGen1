package com.linguagen.backend.controller;

import com.linguagen.backend.dto.CommunityDTO;
import com.linguagen.backend.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CommunityController {

    @Autowired
    private CommunityService service;

    // 게시글 작성
    @PostMapping
    public ResponseEntity<CommunityDTO> createCommunityPost(@RequestBody CommunityDTO communityDTO) {
        CommunityDTO createdCommunityPost = service.createCommunityPost(communityDTO);
        return ResponseEntity.ok(createdCommunityPost);
    }

    // 게시글 수정
    @PutMapping("/{idx}")
    public ResponseEntity<CommunityDTO> updateCommunityPost(@PathVariable Long idx, @RequestBody CommunityDTO updateCommunity, @RequestParam String userId) {
        Optional<CommunityDTO> updated = service.updateCommunityPost(idx, updateCommunity, userId);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 게시글 삭제
    @DeleteMapping("/{idx}")
    public ResponseEntity<Void> deleteCommunityPost(@PathVariable Long idx, @RequestParam String userId) {
        boolean deleted = service.deleteCommunityPost(idx, userId);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // 게시글 조회 (단일)
    @GetMapping("/{idx}")
    public ResponseEntity<CommunityDTO> getCommunityByIdx(@PathVariable Long idx) {
        Optional<CommunityDTO> community = service.getCommunityByIdx(idx);
        return community.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 게시글 조회 (전체)
    @GetMapping
    public ResponseEntity<List<CommunityDTO>> getAllCommunityPosts() {
        List<CommunityDTO> communities = service.getAllCommunityPosts();
        return ResponseEntity.ok(communities);
    }

    // 게시글 검색 (제목, 글 작성자)
    @GetMapping("/search")
    public ResponseEntity<List<CommunityDTO>> searchCommunity(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String nickname) {

        List<CommunityDTO> communities;
        if (title != null) {
            communities = service.searchPostsByTitle(title);
        } else if (userId != null) {
            communities = service.searchPostsByUserId(userId);
        } else if (nickname != null) {
            communities = service.searchPostsByNickname(nickname);
        } else {
            communities = service.getAllCommunityPosts(); // 기본적으로 모든 게시글 반환
        }
        return ResponseEntity.ok(communities);
    }

    // 카테고리별로 최신 글 4개 가져오기
    @GetMapping("/latest/{category}")
    public List<CommunityDTO> getLatestPostsByCategory(@PathVariable String category) {
        return service.getLatestPostsByCategory(category);
    }

    // 사용자가 작성한 게시글 확인
    @GetMapping("/{userId}")
    public ResponseEntity<List<CommunityDTO>> getUserCommunityPosts(@PathVariable String userId) {
        List<CommunityDTO> communities = service.getUserCommunityPosts(userId);
        return ResponseEntity.ok(communities);
    }
}