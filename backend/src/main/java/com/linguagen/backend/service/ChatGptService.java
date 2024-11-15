package com.linguagen.backend.service;

import com.linguagen.backend.dto.LatestStudyInfoDto;
import com.linguagen.backend.dto.LearningAnalysisDTO;
import com.linguagen.backend.entity.Question;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatGptService {

    private final OpenAiService openAiService;
    private final Map<String, List<ChatMessage>> chatHistories = new HashMap<>();

    @Lazy
    private final LearningAnalysisService learningAnalysisService;
    private final DashBoardService dashBoardService;

    private static final String SYSTEM_PROMPT = "당신은 영어 학습을 도와주는 AI 튜터입니다.";

    private void logConversation(String roomId, String type, String content) {
        log.info("""
            
            ====== 대화 로그 ======
            채팅방 ID: {}
            메시지 타입: {}
            내용:
            {}
            ===================
            """,
            roomId, type, content);
    }

    private String convertGradeToString(Byte grade) {
        if (grade == null) return "없음";

        return switch (grade) {
            case 1 -> "브론즈";
            case 2 -> "실버";
            case 3 -> "골드";
            case 4 -> "플래티넘";
            case 5 -> "다이아몬드";
            case 6 -> "챌린저";
            default -> "없음";
        };
    }

    private String createSystemPromptWithAnalysis(String studentId) {
        LearningAnalysisDTO analysis = learningAnalysisService.analyzeLearning(studentId);

        // null 체크를 위한 기본값 설정
        Double correctRate = analysis.getAverageCorrectRate() != null ? analysis.getAverageCorrectRate() * 100 : 0.0;
        String recommendedLevel = analysis.getRecommendedLevel() != null ? analysis.getRecommendedLevel() : "초급";
        String studyPattern = analysis.getStudyPattern() != null ? analysis.getStudyPattern() : "학습 시작 단계";
        Integer weeklyCount = analysis.getWeeklyStudyCount() != null ? analysis.getWeeklyStudyCount() : 0;
        List<String> weakPoints = analysis.getWeakPoints() != null ? analysis.getWeakPoints() : new ArrayList<>();
        Integer totalSessions = analysis.getTotalSessions() != null ? analysis.getTotalSessions() : 0;
        List<String> studyDays = analysis.getStudyDays() != null ? analysis.getStudyDays() : new ArrayList<>();

        // 현재 난이도 정보 처리
        Byte currentGrade = analysis.getCurrentDifficultyGrade();
        Byte currentTier = analysis.getCurrentDifficultyTier();
        String diffGrade = convertGradeToString(currentGrade);
        String diffTier = currentTier != null ? String.valueOf(currentTier) : "없음";

        // 학습 유형 정보
        String type = "없음";
        if (!weakPoints.isEmpty()) {
            type = weakPoints.get(0); // 가장 취약한 유형을 현재 학습 유형으로 설정
        }

        return String.format("""
    %s
    
    ### 학습자 프로필 분석
    
    현재 학습자의 프로필:
    • 평균 정답률: %.1f%%
    • 추천 레벨: %s
    • 학습 패턴: %s
    • 주간 학습 일수: %d일
    • 취약 분야: %s
    • 총 학습 세션: %d회
    • 주요 학습 유형: %s
    • 현재 난이도: %s (Tier %s)
    • 이번 주 학습 요일: %s
    
    ### 학습자 분석 결과
    
    1. 학습 성실도: %s
    2. 실력 수준: %s
    3. 개선이 필요한 영역: %s
    
    ### 응답 지침
    먼저 위 프로필을 바탕으로 학습자의 현재 상태를 간단히 요약해주세요.
    위 정보를 바탕으로 다음 세 가지 영역에 대해 구체적이고 실천 가능한 조언을 제공해주세요:
    
    1. 학습 패턴 개선 방안:
       • 현재 학습 패턴의 장단점
       • 구체적인 개선 방법 제안
    
    2. 취약 분야 극복 전략:
       • 각 취약 분야별 맞춤형 학습 방법
       • 실천 가능한 일일/주간 학습 계획
    
    3. 다음 단계 준비:
       • 현재 레벨에서 보완해야 할 부분
       • 다음 난이도 진입을 위한 구체적인 준비사항
    
    각 조언은 현재 수준에 맞게 단계적으로 제시해주세요.
    응답 시 학습자의 현재 수준과 학습 패턴을 고려하여 단계적이고 실현 가능한 조언을 제공해주세요.
    """,
            SYSTEM_PROMPT,
            correctRate,
            recommendedLevel,
            studyPattern,
            weeklyCount,
            String.join(", ", weakPoints),
            totalSessions,
            type,
            diffGrade,
            diffTier,
            formatStudyDays(studyDays),
            analyzeStudyDiligence(weeklyCount, studyPattern),
            analyzeProficiencyLevel(correctRate, totalSessions),
            analyzeImprovementAreas(weakPoints)
        );
    }

    private String formatStudyDays(List<String> studyDays) {
        return studyDays.stream()
            .map(day -> day.substring(0, 1).toUpperCase() + day.substring(1).toLowerCase())
            .collect(Collectors.joining(", "));
    }

    private String analyzeStudyDiligence(Integer weeklyCount, String studyPattern) {
        if (weeklyCount >= 5) {
            return "매우 우수한 학습 참여도를 보이고 있습니다";
        } else if (weeklyCount >= 3) {
            return "꾸준한 학습을 이어가고 있습니다";
        } else if (weeklyCount >= 1) {
            return "더 많은 학습 참여가 필요합니다";
        } else {
            return "학습 시작 단계입니다";
        }
    }

    private String analyzeProficiencyLevel(Double correctRate, Integer totalSessions) {
        if (correctRate >= 85 && totalSessions >= 30) {
            return "상급 수준에 도달했습니다";
        } else if (correctRate >= 70 && totalSessions >= 15) {
            return "중급 수준을 보여주고 있습니다";
        } else if (correctRate >= 50 && totalSessions >= 5) {
            return "기초를 다지고 있는 단계입니다";
        } else {
            return "학습 초기 단계입니다";
        }
    }

    private String analyzeImprovementAreas(List<String> weakPoints) {
        if (weakPoints.isEmpty()) {
            return "아직 충분한 학습 데이터가 없습니다";
        }
        return String.join(", ", weakPoints) + " 영역의 보완이 필요합니다";
    }

    public String getChatbotResponse(String roomId, String userMessage, String studentId) {
        List<ChatMessage> messages = chatHistories.computeIfAbsent(roomId, k -> {
            List<ChatMessage> newMessages = new ArrayList<>();
            String systemPrompt = createSystemPromptWithAnalysis(studentId);
            logConversation(roomId, "시스템 프롬프트", systemPrompt);
            newMessages.add(new ChatMessage("system", systemPrompt));
            return newMessages;
        });

        logConversation(roomId, "사용자 메시지", userMessage);
        ChatMessage userChatMessage = new ChatMessage("user", userMessage);
        messages.add(userChatMessage);

        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-4o-mini")
                .messages(messages)
                .temperature(0.7)
                .maxTokens(1000)
                .build();

            long startTime = System.currentTimeMillis();
            ChatCompletionResult result = openAiService.createChatCompletion(request);
            long endTime = System.currentTimeMillis();

            String botResponse = result.getChoices().get(0).getMessage().getContent();
            String formattedResponse = formatResponse(botResponse);

            logConversation(roomId, "봇 응답", formattedResponse);
            log.info("응답 시간: {}ms", endTime - startTime);

            ChatMessage botChatMessage = new ChatMessage("assistant", formattedResponse);
            messages.add(botChatMessage);

            return formattedResponse;

        } catch (Exception e) {
            String errorMessage = "ChatGPT API 호출 중 오류 발생: " + e.getMessage();
            log.error(errorMessage, e);
            throw new RuntimeException(errorMessage, e);
        }
    }

    private String formatResponse(String response) {
        log.debug("포맷팅 전 응답: {}", response);

        // 1. 초기 응답 정리
        String formatted = response.trim()
            .replaceAll("\\*\\*(.*?)\\*\\*", "$1")
            .replaceAll("###\\s*([^\\n]+)", "\n<div class='chat-section'>$1</div>")
            .replaceAll("<EOL>", "\n")
            .replaceAll("\\s*:\\s*", ": ");

        // 2. 중첩 목록 구조화
        formatted = formatNestedLists(formatted);

        // 3. 섹션 정리
        formatted = cleanupSections(formatted);

        log.debug("포맷팅 후 응답: {}", formatted);
        return formatted;
    }

    private String formatNestedLists(String text) {
        List<String> lines = Arrays.asList(text.split("\n"));
        StringBuilder result = new StringBuilder();
        int currentLevel = 0;
        boolean inList = false;

        for (String line : lines) {
            String trimmed = line.trim();

            // 새로운 섹션 시작
            if (trimmed.startsWith("<div class='chat-section'>")) {
                if (inList) {
                    result.append("\n");
                    inList = false;
                }
                result.append("\n").append(trimmed).append("\n");
                continue;
            }

            // 목록 항목 처리
            if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.matches("^\\d+\\..*")) {
                // 목록 시작
                if (!inList) {
                    result.append("\n");
                    inList = true;
                }

                // 들여쓰기 레벨 확인
                int level = getIndentationLevel(line);
                String formattedLine = formatListItem(trimmed, level);

                // 줄바꿈 및 들여쓰기 적용
                if (level > currentLevel) {
                    result.append("\n");
                }
                result.append(formattedLine).append("\n");
                currentLevel = level;
            } else {
                // 일반 텍스트 처리
                if (!trimmed.isEmpty()) {
                    if (inList) {
                        result.append("\n");
                        inList = false;
                    }
                    result.append(trimmed).append("\n");
                }
            }
        }

        return result.toString().trim();
    }

    private String formatListItem(String item, int level) {
        item = item.trim();
        // 기호 통일
        if (item.startsWith("-")) {
            item = "•" + item.substring(1);
        }
        // 들여쓰기 적용
        String indent = "  ".repeat(level);
        return indent + item;
    }

    private int getIndentationLevel(String line) {
        int spaces = 0;
        while (spaces < line.length() && line.charAt(spaces) == ' ') {
            spaces++;
        }
        return spaces / 2;
    }

    private String cleanupSections(String text) {
        return text
            // 1. 섹션 간격 조정
            .replaceAll("(\n\\s*)+(<div class='chat-section'>)", "\n\n$2")
            .replaceAll("</div>(\n\\s*)+", "</div>\n")

            // 2. 목록 항목 정리
            .replaceAll("•\\s+", "• ")
            .replaceAll("(\\d+)\\.\\s+", "$1. ")

            // 3. 중복 줄바꿈 제거
            .replaceAll("\n{3,}", "\n\n")

            // 4. 최종 정리
            .replaceAll("(?m)\\s+$", "")
            .trim();
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