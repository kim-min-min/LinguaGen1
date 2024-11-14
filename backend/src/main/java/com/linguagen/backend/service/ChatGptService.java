package com.linguagen.backend.service;

import com.linguagen.backend.dto.LearningAnalysisDTO;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatGptService {

    private final OpenAiService openAiService;
    private final Map<String, List<ChatMessage>> chatHistories = new HashMap<>();

    @Lazy
    private final LearningAnalysisService learningAnalysisService;

    private static final String SYSTEM_PROMPT = "당신은 영어 학습을 도와주는 AI 튜터입니다.";

    private String createSystemPromptWithAnalysis(String studentId) {
        LearningAnalysisDTO analysis = learningAnalysisService.analyzeLearning(studentId);

        return String.format("""
            %s
            현재 학습자의 프로필:
            - 평균 정답률: %.1f%%
            - 추천 레벨: %s
            - 학습 패턴: %s
            - 주간 학습 일수: %d일
            - 취약 분야: %s
            
            이 정보를 바탕으로 학습자의 수준과 취약점을 고려하여 맞춤형 답변을 제공해주세요.
            """,
            SYSTEM_PROMPT,
            analysis.getAverageCorrectRate(),
            analysis.getRecommendedLevel(),
            analysis.getStudyPattern(),
            analysis.getWeeklyStudyCount(),
            String.join(", ", analysis.getWeakPoints())
        );
    }

    public String getChatbotResponse(String roomId, String userMessage, String studentId) {
        List<ChatMessage> messages = chatHistories.computeIfAbsent(roomId, k -> {
            List<ChatMessage> newMessages = new ArrayList<>();
            String systemPrompt = createSystemPromptWithAnalysis(studentId);
            newMessages.add(new ChatMessage("system", systemPrompt));
            return newMessages;
        });

        // 사용자 메시지 추가
        ChatMessage userChatMessage = new ChatMessage("user", userMessage);
        messages.add(userChatMessage);

        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-4o-mini")
                .messages(messages)
                .temperature(0.7)
                .maxTokens(1000)
                .build();

            ChatCompletionResult result = openAiService.createChatCompletion(request);
            String botResponse = result.getChoices().get(0).getMessage().getContent();

            // 응답 형식 개선
            String formattedResponse = formatResponse(botResponse);

            // 봇 응답 저장
            ChatMessage botChatMessage = new ChatMessage("assistant", formattedResponse);
            messages.add(botChatMessage);

            return formattedResponse;

        } catch (Exception e) {
            // API 호출 실패 시 에러 처리
            throw new RuntimeException("ChatGPT API 호출 중 오류 발생: " + e.getMessage(), e);
        }
    }

    private String formatResponse(String response) {

        // 포맷팅 전 응답 출력
        System.out.println("Before formatting: " + response);

        // 응답을 보기 좋게 포맷팅하는 로직
        String formattedResponse = response
            .replaceAll("\\*\\*(.*?)\\*\\*", "$1") // **단어**에서 기호 제거
            .replaceAll("<EOL>", "\n") // <EOL>을 줄바꿈으로 변환
            .replaceAll("(?<=\\d)(?=\\s*-)", "\n") // 숫자와 하이픈 사이에 줄바꿈 추가
            .replaceAll("(?<=\\w)(?=\\s*\\.)", "\n") // 단어와 마침표 사이에 줄바꿈 추가
            .replaceAll("(?<=\\w)(?=\\s*:)", "\n") // 단어와 콜론 사이에 줄바꿈 추가
            .replaceAll("(?<=\\w)(?=\\s*\\()", "\n") // 단어와 여는 괄호 사이에 줄바꿈 추가
            .replaceAll("(?<=\\w)(?=\\s*\\))", "\n"); // 단어와 닫는 괄호 사이에 줄바꿈 추가

        // 포맷팅 후 응답 출력
        System.out.println("After formatting: " + formattedResponse);

        return formattedResponse;
    }

    // 채팅방의 대화 기록을 초기화하되, 시스템 프롬프트는 유지
    public void clearChatHistory(String roomId) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("system", SYSTEM_PROMPT));
        chatHistories.put(roomId, messages);
    }

    // 채팅방의 현재 컨텍스트 크기 확인 (토큰 관리용)
    public int getContextSize(String roomId) {
        List<ChatMessage> messages = chatHistories.get(roomId);
        if (messages == null) return 0;

        return messages.stream()
            .mapToInt(msg -> msg.getContent().length())
            .sum();
    }
}