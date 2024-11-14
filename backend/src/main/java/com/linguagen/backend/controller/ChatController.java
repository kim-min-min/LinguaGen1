package com.linguagen.backend.controller;

import com.linguagen.backend.service.ChatGptService;
import com.linguagen.backend.dto.ChatRequestDTO;
import com.linguagen.backend.dto.ChatResponseDTO;
import com.linguagen.backend.util.SessionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatGptService chatGptService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponseDTO> sendMessage(@RequestBody ChatRequestDTO chatRequest) {
        // 세션에서 studentId 가져오기
        String studentId = SessionUtil.getCurrentUserId();

        // studentId가 null이 아닌지 확인
        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String botResponse = chatGptService.getChatbotResponse(
            chatRequest.getRoomId(),
            chatRequest.getMessage(),
            studentId // 세션에서 가져온 studentId 사용
        );
        return ResponseEntity.ok(new ChatResponseDTO(botResponse));
    }

    @DeleteMapping("/room/{roomId}")
    public ResponseEntity<Void> deleteChatHistory(@PathVariable String roomId) {
        chatGptService.clearChatHistory(roomId);
        return ResponseEntity.noContent().build();
    }
}