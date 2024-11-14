package com.linguagen.backend.scheduler;

import com.linguagen.backend.dto.QuestionGenerationRequestDTO;
import com.linguagen.backend.entity.Choices;
import com.linguagen.backend.entity.Question;
import com.linguagen.backend.repository.QuestionRepository;
import com.linguagen.backend.service.OpenAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class QuestionGenerationSchedulerService {
    // 객관식 문제의 답안 분포를 위한 상수
    private static final double MULTIPLE_CHOICE_PROBABILITY = 0.6; // 객관식 비율을 60%로 조정
    private static final String[] ANSWER_OPTIONS = {"A", "B", "C", "D"};
    // 단어 수 범위 매핑을 위한 상수 정의
    private static final Map<String, int[]> WORD_COUNT_RANGES = Map.ofEntries(
        Map.entry("A1", new int[]{30, 50}),
        Map.entry("A1+", new int[]{40, 60}),
        Map.entry("A2", new int[]{50, 80}),
        Map.entry("A2+", new int[]{70, 100}),
        Map.entry("B1", new int[]{80, 120}),
        Map.entry("B1+", new int[]{100, 150}),
        Map.entry("B2", new int[]{120, 180}),
        Map.entry("B2+", new int[]{150, 200}),
        Map.entry("C1", new int[]{180, 230}),
        Map.entry("C1+", new int[]{200, 250}),
        Map.entry("C2", new int[]{230, 300})
    );
    private final QuestionRepository questionRepository;
    private final OpenAIService openAIService;
    private final Random random = new Random(); // 전역 Random 객체 추가

    // 테스트용 1분 주기 실행
//    @Scheduled(fixedDelay = 30000)
    // 실제 운영시에는 매일 새벽 3시에 실행
//    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void generateSampleQuestion() {
        try {
            log.info("Starting sample question generation...");

            // 다양한 주제와 유형을 배열로 준비
            String[] topics = {"여행", "비지니스", "일상회화", "영화", "드라마", "애니메이션", "문학", "일반"};
            String[] questionTypes = {"리딩", "리스닝"};
            String[] detailTypes = {"주제/제목 찾기", "요지 파악", "세부 정보 찾기", "지칭 추론", "어휘 추론"};
            String[] grades = {"브론즈", "실버", "골드", "플래티넘", "다이아몬드"};

            // 랜덤하게 선택
            QuestionGenerationRequestDTO request = new QuestionGenerationRequestDTO();
            request.setTopic(topics[random.nextInt(topics.length)]);
            request.setGrade(grades[random.nextInt(grades.length)]);
            request.setTier(random.nextInt(3) + 1); // 1-3 티어
            request.setQuestionType(questionTypes[random.nextInt(questionTypes.length)]);
            request.setDetailType(detailTypes[random.nextInt(detailTypes.length)]);

            log.info("Generating question with parameters: topic={}, grade={}, tier={}, type={}, detailType={}",
                request.getTopic(), request.getGrade(), request.getTier(),
                request.getQuestionType(), request.getDetailType());

            Question question = generateSingleQuestion(request);
            Question savedQuestion = questionRepository.save(question);

            logGeneratedQuestion(savedQuestion);

        } catch (Exception e) {
            log.error("Error during sample question generation: ", e);
        }
    }

    private void logGeneratedQuestion(Question savedQuestion) {
        log.info("Successfully generated a question:");
        log.info("ID: {}", savedQuestion.getIdx());
        log.info("Type: {}", savedQuestion.getType());
        log.info("Detail Type: {}", savedQuestion.getDetailType());
        log.info("Interest: {}", savedQuestion.getInterest());
        log.info("Format: {}", savedQuestion.getQuestionFormat());
        log.info("Question: {}", savedQuestion.getQuestion());
        log.info("Correct Answer: {}", savedQuestion.getCorrectAnswer());

        if (savedQuestion.getQuestionFormat() == Question.QuestionFormat.MULTIPLE_CHOICE) {
            savedQuestion.getChoices().forEach(choice ->
                log.info("Choice {}: {}", choice.getChoiceLabel(), choice.getChoiceText())
            );
        }
    }

    // 수정된 generateSingleQuestion 메소드
    private Question generateSingleQuestion(QuestionGenerationRequestDTO request) {
        String questionFormat = determineQuestionFormat(request.getQuestionType(), request.getDetailType());

        // CEFR 레벨 결정
        CEFRLevel cefrLevel = determineCEFRLevel(request.getGrade(), request.getTier());

        String prompt = buildPrompt(
            request.getTopic(),
            String.format("%s %d티어", request.getGrade(), request.getTier()),
            cefrLevel.toString(),
            request.getQuestionType(),
            request.getDetailType(),
            questionFormat
        );

        log.info("Generating question with CEFR level: {}", cefrLevel);
        log.info("Generated prompt:\n{}", prompt);

        String response = openAIService.getCompletion(prompt);
        return parseResponse(response, request);
    }

    private String determineQuestionFormat(String questionType, String detailType) {
        if (detailType.contains("말하기") || detailType.contains("쓰기")) {
            return "short-answer";
        }
        return random.nextDouble() < MULTIPLE_CHOICE_PROBABILITY ? "multiple-choice" : "short-answer";
    }

    // CEFR 레벨 매핑 메소드 수정
    private CEFRLevel determineCEFRLevel(String grade, int tier) {
        return switch (grade.toLowerCase()) {
            case "브론즈" -> switch (tier) {
                case 4 -> new CEFRLevel("A1", "기초 단계");
                case 3 -> new CEFRLevel("A1+", "기초 심화 단계");
                case 2 -> new CEFRLevel("A2", "초급 초반 단계");
                case 1 -> new CEFRLevel("A2", "초급 후반 단계");
                default -> throw new IllegalArgumentException("Invalid tier for 브론즈: " + tier);
            };
            case "실버" -> switch (tier) {
                case 4 -> new CEFRLevel("A2+", "초급 심화 단계");
                case 3 -> new CEFRLevel("B1", "중급 초반 단계");
                case 2 -> new CEFRLevel("B1", "중급 중반 단계");
                case 1 -> new CEFRLevel("B1", "중급 후반 단계");
                default -> throw new IllegalArgumentException("Invalid tier for 실버: " + tier);
            };
            case "골드" -> switch (tier) {
                case 4 -> new CEFRLevel("B1+", "중급 심화 단계");
                case 3 -> new CEFRLevel("B2", "중상급 초반 단계");
                case 2 -> new CEFRLevel("B2", "중상급 중반 단계");
                case 1 -> new CEFRLevel("B2", "중상급 후반 단계");
                default -> throw new IllegalArgumentException("Invalid tier for 골드: " + tier);
            };
            case "플래티넘" -> switch (tier) {
                case 4 -> new CEFRLevel("B2+", "중상급 심화 단계");
                case 3 -> new CEFRLevel("C1", "고급 초반 단계");
                case 2 -> new CEFRLevel("C1", "고급 중반 단계");
                case 1 -> new CEFRLevel("C1", "고급 후반 단계");
                default -> throw new IllegalArgumentException("Invalid tier for 플래티넘: " + tier);
            };
            case "다이아몬드" -> switch (tier) {
                case 4 -> new CEFRLevel("C1+", "고급 심화 단계");
                case 3 -> new CEFRLevel("C2", "최상급 초반 단계");
                case 2 -> new CEFRLevel("C2", "최상급 중반 단계");
                case 1 -> new CEFRLevel("C2", "최상급 후반 단계");
                default -> throw new IllegalArgumentException("Invalid tier for 다이아몬드: " + tier);
            };
            default -> throw new IllegalArgumentException("Invalid grade: " + grade);
        };
    }

    private Question parseResponse(String response, QuestionGenerationRequestDTO request) {
        Question question = new Question();

        question.setType(request.getQuestionType());
        question.setDetailType(request.getDetailType());
        question.setInterest(request.getTopic());
        question.setDiffGrade(convertGradeToByte(request.getGrade()));
        question.setDiffTier((byte) request.getTier().intValue());

        String format = determineQuestionFormat(request.getQuestionType(), request.getDetailType());
        question.setQuestionFormat(format.equals("multiple-choice") ?
            Question.QuestionFormat.MULTIPLE_CHOICE :
            Question.QuestionFormat.SHORT_ANSWER);

        extractContent(response, question);
        validateQuestion(question);

        return question;
    }

    private void validateQuestion(Question question) {
        if (question.getQuestionFormat() == Question.QuestionFormat.MULTIPLE_CHOICE) {
            if (question.getCorrectAnswer() == null ||
                !question.getCorrectAnswer().matches("[A-D]")) {
                // 유효하지 않은 답안인 경우 랜덤하게 하나 선택
                question.setCorrectAnswer(ANSWER_OPTIONS[random.nextInt(ANSWER_OPTIONS.length)]);
                log.warn("Invalid multiple choice answer format - randomly assigned: {}",
                    question.getCorrectAnswer());
            }
            if (question.getChoices().size() != 4) {
                throw new IllegalStateException("Multiple choice question must have exactly 4 choices");
            }
        } else {
            if (question.getCorrectAnswer() == null || question.getCorrectAnswer().trim().isEmpty()) {
                throw new IllegalStateException("Short answer question must have a non-empty correct answer");
            }
        }
    }

    private byte convertGradeToByte(String grade) {
        return switch (grade) {
            case "브론즈" -> (byte) 1;
            case "실버" -> (byte) 2;
            case "골드" -> (byte) 3;
            case "플래티넘" -> (byte) 4;
            case "다이아몬드" -> (byte) 5;
            case "챌린저" -> (byte) 6;
            default -> throw new IllegalArgumentException("Invalid grade: " + grade);
        };
    }

    // extractContent 메소드 수정
    private void extractContent(String response, Question question) {
        // 지문 추출
        Matcher passageMatcher = Pattern.compile("지문:(.*?)(?=질문:)", Pattern.DOTALL).matcher(response);
        if (passageMatcher.find()) {
            question.setPassage(cleanText(passageMatcher.group(1)));
        }

        // 먼저 문제 형식 확인
        boolean hasMultipleChoice = response.contains("보기:") &&
            response.matches("(?s).*[A-D][.)]\\s+.*[A-D][.)]\\s+.*");

        // 실제 형식과 설정된 형식이 다른 경우 조정
        if (hasMultipleChoice && question.getQuestionFormat() == Question.QuestionFormat.SHORT_ANSWER) {
            question.setQuestionFormat(Question.QuestionFormat.MULTIPLE_CHOICE);
        } else if (!hasMultipleChoice && question.getQuestionFormat() == Question.QuestionFormat.MULTIPLE_CHOICE) {
            question.setQuestionFormat(Question.QuestionFormat.SHORT_ANSWER);
        }

        // 질문 추출
        if (question.getQuestionFormat() == Question.QuestionFormat.MULTIPLE_CHOICE) {
            Matcher questionMatcher = Pattern.compile("질문:(.*?)(?=보기:|정답:)", Pattern.DOTALL).matcher(response);
            if (questionMatcher.find()) {
                String questionText = cleanText(questionMatcher.group(1));
                questionText = questionText.replaceAll("(?i)보기:?[\\s\\S]*", "").trim();
                question.setQuestion(questionText);
            }
            extractMultipleChoiceContent(response, question);
        } else {
            Matcher questionMatcher = Pattern.compile("질문:(.*?)(?=정답:|$)", Pattern.DOTALL).matcher(response);
            if (questionMatcher.find()) {
                String questionText = cleanText(questionMatcher.group(1));
                question.setQuestion(questionText);
            }
            extractShortAnswerContent(response, question);
        }

        // 해설 추출
        Matcher explanationMatcher = Pattern.compile("해설:(.*?)$", Pattern.DOTALL).matcher(response);
        if (explanationMatcher.find()) {
            question.setExplanation(cleanText(explanationMatcher.group(1)));
        }
    }

    private void extractMultipleChoiceContent(String response, Question question) {
        try {
            Pattern choicesSectionPattern = Pattern.compile("보기:(.*?)(?=정답:)", Pattern.DOTALL);
            Matcher sectionMatcher = choicesSectionPattern.matcher(response);

            if (sectionMatcher.find()) {
                String choicesSection = sectionMatcher.group(1).trim();

                // 보기 텍스트 추출 패턴 수정
                Pattern choicesPattern = Pattern.compile(
                        "(?:^|\\n)\\s*(?:\\d+\\.)?\\s*([A-D])[.:]\\s*([^\\n]*?)(?=\\n\\s*(?:\\d+\\.)?\\s*[A-D][.:]|$)",
                        Pattern.DOTALL
                );
                Matcher choicesMatcher = choicesPattern.matcher(choicesSection);

                while (choicesMatcher.find()) {
                    String label = choicesMatcher.group(1).trim();
                    String text = choicesMatcher.group(2)
                            .replaceAll("^\\s*[A-D][.:]\\s*", "") // 앞쪽 레이블 제거
                            .replaceAll("\\s*[A-D][.:]\\s*$", "") // 뒤쪽 레이블 제거
                            .trim();

                    if (!text.isEmpty()) {
                        Choices choice = new Choices();
                        choice.setQuestion(question);
                        choice.setChoiceLabel(label);
                        choice.setChoiceText(text.trim());
                        question.getChoices().add(choice);
                    }
                }
            }

            // 정답 추출
            Pattern answerPattern = Pattern.compile("정답:\\s*([A-D])(?=\\s|$|\\.|,|\\n|해설:)", Pattern.DOTALL);
            Matcher answerMatcher = answerPattern.matcher(response);

            if (answerMatcher.find()) {
                String answer = answerMatcher.group(1).trim();
                if (answer.matches("[A-D]")) {
                    question.setCorrectAnswer(answer);
                } else {
                    question.setCorrectAnswer(ANSWER_OPTIONS[random.nextInt(ANSWER_OPTIONS.length)]);
                }
            } else {
                question.setCorrectAnswer(ANSWER_OPTIONS[random.nextInt(ANSWER_OPTIONS.length)]);
            }

            if (question.getChoices().size() < 4) {
                completeChoices(question);
            }

        } catch (Exception e) {
            log.error("Error extracting multiple choice content: ", e);
            throw new IllegalStateException("Failed to extract multiple choice content properly");
        }
    }

    // 선택지 보완 메소드 개선
    private void completeChoices(Question question) {
        Set<String> existingLabels = question.getChoices().stream()
            .map(Choices::getChoiceLabel)
            .collect(Collectors.toSet());

        // 기존 선택지들의 텍스트 분석을 위한 리스트
        List<String> existingTexts = question.getChoices().stream()
            .map(Choices::getChoiceText)
            .collect(Collectors.toList());

        // 부족한 선택지 생성 요청을 위한 프롬프트 구성
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("다음 영어 지문과 질문, 그리고 기존 보기들을 참고하여 missing labels(")
            .append(String.join(", ", getMissingLabels(existingLabels)))
            .append(")에 대한 추가 보기를 생성해주세요.\n\n");

        promptBuilder.append("지문:\n").append(question.getPassage()).append("\n\n");
        promptBuilder.append("질문:\n").append(question.getQuestion()).append("\n\n");

        if (!existingTexts.isEmpty()) {
            promptBuilder.append("기존 보기:\n");
            int i = 0;
            for (String label : existingLabels) {
                promptBuilder.append(label).append(". ").append(existingTexts.get(i++)).append("\n");
            }
        }

        promptBuilder.append("\n요구사항:\n");
        promptBuilder.append("1. 지문의 내용과 연관성 있는 보기 생성\n");
        promptBuilder.append("2. 기존 보기들과 비슷한 길이와 스타일 유지\n");
        promptBuilder.append("3. 명확하게 오답임을 알 수 있는 보기 생성\n");
        promptBuilder.append("4. 각 보기는 한 줄로 작성\n");
        promptBuilder.append("5. 레이블(A, B, C, D)은 제외하고 보기 내용만 작성\n\n");

        String additionalChoicesResponse = openAIService.getCompletion(promptBuilder.toString());

        // 응답에서 새로운 보기 추출
        Map<String, String> newChoices = extractNewChoices(additionalChoicesResponse, getMissingLabels(existingLabels));

        // 새로운 보기 추가
        for (String label : ANSWER_OPTIONS) {
            if (!existingLabels.contains(label)) {
                Choices choice = new Choices();
                choice.setQuestion(question);
                choice.setChoiceLabel(label);
                // 새로 생성된 보기 텍스트 사용, 실패 시 대체 텍스트 사용
                choice.setChoiceText(newChoices.getOrDefault(label, createFallbackChoice(label, question)));
                question.getChoices().add(choice);
            }
        }
    }

    // 없는 레이블 찾기
    private List<String> getMissingLabels(Set<String> existingLabels) {
        return Arrays.stream(ANSWER_OPTIONS)
            .filter(label -> !existingLabels.contains(label))
            .collect(Collectors.toList());
    }

    // 새로운 보기 추출
    private Map<String, String> extractNewChoices(String response, List<String> missingLabels) {
        Map<String, String> newChoices = new HashMap<>();

        // 줄 단위로 응답 분리
        String[] lines = response.split("\n");
        int labelIndex = 0;

        for (String line : lines) {
            if (labelIndex >= missingLabels.size()) break;

            line = line.trim();
            if (!line.isEmpty() && !line.startsWith("보기:") && !line.startsWith("요구사항:")) {
                // 레이블이 있는 경우 제거
                line = line.replaceAll("^[A-D][.)]\\s*", "").trim();
                if (!line.isEmpty()) {
                    newChoices.put(missingLabels.get(labelIndex), line);
                    labelIndex++;
                }
            }
        }

        return newChoices;
    }

    // 대체 보기 생성 (AI 응답 실패 시 사용)
    private String createFallbackChoice(String label, Question question) {
        String questionType = question.getDetailType();

        return switch (questionType) {
            case "주제/제목 찾기" -> switch (label) {
                case "A" -> "지문의 세부 내용을 설명하는 제목";
                case "B" -> "지문과 관련 없는 일반적인 주제";
                case "C" -> "지문에서 언급된 부수적인 내용";
                case "D" -> "지문의 소재와 관련된 다른 주제";
                default -> "지문과 관련된 대체 주제";
            };
            case "요지 파악" -> switch (label) {
                case "A" -> "지문의 부분적인 내용을 확대 해석";
                case "B" -> "지문에서 언급되지 않은 결론";
                case "C" -> "지문의 문맥과 반대되는 내용";
                case "D" -> "지문의 핵심과 무관한 내용";
                default -> "지문의 요지와 관련된 내용";
            };
            case "세부 정보 찾기" -> switch (label) {
                case "A" -> "지문에서 언급되지 않은 세부 사항";
                case "B" -> "지문의 내용을 과장된 형태로 표현";
                case "C" -> "지문의 내용과 일부만 일치하는 정보";
                case "D" -> "지문의 문맥상 맞지 않는 정보";
                default -> "지문에서 확인할 수 없는 정보";
            };
            case "지칭 추론" -> switch (label) {
                case "A" -> "지문에서 언급되지 않은 대상";
                case "B" -> "문맥상 연관성이 낮은 대상";
                case "C" -> "지문의 다른 부분에서 언급된 대상";
                case "D" -> "유사하지만 다른 의미의 대상";
                default -> "지문과 관련된 다른 대상";
            };
            case "어휘 추론" -> switch (label) {
                case "A" -> "문맥과 맞지 않는 유의어";
                case "B" -> "발음이 비슷한 다른 단어";
                case "C" -> "반대 의미를 가진 단어";
                case "D" -> "형태만 유사한 다른 단어";
                default -> "문맥상 적절하지 않은 단어";
            };
            default -> "지문의 내용과 관련된 대안적 설명";
        };
    }

    // extractShortAnswerContent 메소드 개선
    private void extractShortAnswerContent(String response, Question question) {
        try {
            // 정답 섹션 추출 (정답: ~ 해설: 사이의 내용)
            Pattern answerPattern = Pattern.compile("정답:(.*?)(?=해설:|$)", Pattern.DOTALL);
            Matcher answerMatcher = answerPattern.matcher(response);

            if (answerMatcher.find()) {
                String rawAnswer = answerMatcher.group(1).trim();

                // 객관식 형태의 답변이 있는지 확인하되, 단순히 A, B, C, D가 포함된 경우는 허용
                if (rawAnswer.matches(".*[A-D][.)].*")) {
                    // 객관식 형태의 답변이 발견되면 영어 단어/구문 찾기 시도
                    Pattern englishPattern = Pattern.compile("\\b[A-Za-z\\s]+\\b");
                    Matcher englishMatcher = englishPattern.matcher(rawAnswer);

                    if (englishMatcher.find()) {
                        rawAnswer = englishMatcher.group().trim();
                    } else {
                        throw new IllegalStateException("No valid English answer found in short answer response");
                    }
                }

                String cleanedAnswer = cleanShortAnswer(rawAnswer);
                if (!cleanedAnswer.isEmpty()) {
                    question.setCorrectAnswer(cleanedAnswer);
                } else {
                    throw new IllegalStateException("Short answer cannot be empty");
                }
            } else {
                throw new IllegalStateException("No answer found for short answer question");
            }
        } catch (Exception e) {
            log.error("Error extracting short answer content: ", e);
            throw e;
        }
    }

    // 주관식 답안 정제를 위한 새로운 메소드
    private String cleanShortAnswer(String answer) {
        return answer.trim()
            .replaceAll("^[\\s\\p{Punct}]+", "") // 시작 부분의 특수문자 제거
            .replaceAll("[\\s\\p{Punct}]+$", "") // 끝 부분의 특수문자 제거
            .replaceAll("^[정답은|정답|답]+[은는이가]?\\s*", "") // "정답은", "정답:" 등의 표현 제거
            .replaceAll("입니다$|이다$|함$|다$", "") // 한글 문장 종결 표현 제거
            .trim();
    }

    private String cleanText(String text) {
        if (text == null) return "";
        return text.trim()
            .replaceAll("\\*+", "")
            .replaceAll("[-~.。、,，:：\\s]+$", "")
            .replaceAll("\\s+", " ")
            .replaceAll("^\\s*[.)]\\s*", "")
            .trim();
    }

    // buildPrompt 메소드 수정
    private String buildPrompt(String topic, String tier, String cefrLevelString,
                               String questionType, String detailType, String questionFormat) {

        // CEFR 레벨에 따른 단어 수 범위 결정
        String cefrKey = cefrLevelString.split(" ")[0]; // "B2+" 등의 형태에서 "+" 포함
        int[] lengthRange = WORD_COUNT_RANGES.getOrDefault(
            cefrKey,
            new int[]{80, 120} // 기본값
        );

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("===== 영어 문제 생성 요청 =====\n\n");

        // 기본 정보 섹션
        promptBuilder.append("## 기본 정보\n");
        promptBuilder.append(String.format("- 주제: %s\n", topic));
        promptBuilder.append(String.format("- 난이도: %s\n", tier));
        promptBuilder.append(String.format("- CEFR 등급: %s\n", cefrLevelString));
        promptBuilder.append(String.format("- 문제 유형: %s\n", questionType));
        promptBuilder.append(String.format("- 세부 유형: %s\n", detailType));
        promptBuilder.append(String.format("- 답안 형식: %s\n\n",
            questionFormat.equals("multiple-choice") ? "객관식" : "주관식 단답형"));

        // CEFR 레벨별 구체적인 지침 추가
        promptBuilder.append("## CEFR 레벨별 요구사항\n");
        promptBuilder.append(getCEFRLevelGuidelines(cefrKey));

        // 지문 길이 요구사항
        promptBuilder.append(String.format("\n## 지문 요구사항\n"));
        promptBuilder.append(String.format("- 단어 수: %d-%d 단어\n", lengthRange[0], lengthRange[1]));
        promptBuilder.append("- 문장의 복잡도와 어휘 수준은 CEFR 등급에 맞춰 조정\n");

        if (questionType.equals("리스닝")) {
            promptBuilder.append("2. 지문 형식: A와 B의 자연스러운 대화체로 작성\n");
        }
        promptBuilder.append("3. 질문 작성: 한글로 명확하게 작성\n");

        // 상세 지침
        promptBuilder.append("\n## 상세 지침\n");
        if (questionFormat.equals("multiple-choice")) {
            promptBuilder.append("""
                1. 객관식 답안 요구사항:
                   - 4개의 선택지(A, B, C, D)를 제공할 것
                   - 각 선택지는 명확하게 구분되도록 작성
                   - 정답은 반드시 A, B, C, D 중 하나로만 표시
                   - 모든 선택지가 적절한 길이와 난이도를 유지
                """);
        } else {
            promptBuilder.append("""
                1. 주관식 답안 요구사항:
                                   - 답안은 명확하고 간단한 단어나 구문으로 작성
                                   - 답안에 A, B, C, D와 같은 선택지 형태 사용 금지
                                   - 전체 문장이나 장문의 답안 지양
                                   - 정답은 영어로 작성하되, 2-3단어를 넘지 않도록 함
                                   - 철자와 대소문자를 정확하게 표기
                예시 형식:
                                   질문: [한글로 된 질문]
                                   정답: [간단한 영어 단어/구문]
                                   해설: [한글로 된 해설]
                """);
        }

        promptBuilder.append(String.format("""
                2. 문제 유형별 지침:
                   %s
                
                3. 난이도 관련 지침:
                   - %s 수준에 맞는 어휘와 문법 사용
                   - 지문의 복잡도를 %s 등급에 맞게 조절
                
                4. 해설 작성 지침:
                   - 정답의 근거를 명확하게 제시
                   - 주요 어휘나 표현 설명 포함
                   - 오답을 고른 경우의 함정 설명
                """,
            getQuestionTypeInstruction(detailType),
            cefrLevelString,
            tier
        ));

        // 출력 형식 템플릿
        promptBuilder.append("""
            
            ## 출력 형식
            아래 형식을 정확히 따라 작성해 주세요:
            
            지문:
            [영어 지문 작성]
            
            질문:
            [한글로 질문 작성]
            """);

        if (questionFormat.equals("multiple-choice")) {
            promptBuilder.append("""
                
                 보기:
                 A. [첫 번째 선택지]
                 B. [두 번째 선택지]
                 C. [세 번째 선택지]
                 D. [네 번째 선택지]
                
                 * 보기 작성 시 유의사항:
                 - A, B, C, D 형식으로만 표시
                 - 번호 매기기 사용하지 않음
                 - 각 선택지는 명확하고 간결하게 작성
                """);
        } else {
            promptBuilder.append("""
                
                질문:
                [한글로 된 명확한 질문]
                
                정답:
                [2-3단어 이내의 영어 답안]
                
                해설:
                [한글로 된 상세한 해설]
                """);
        }

        promptBuilder.append("""
            
            정답:
            [답안 작성]
            
            해설:
            [한글로 해설 작성]
            
            ===== 끝 =====
            """);

        return promptBuilder.toString();
    }

    // CEFR 레벨별 가이드라인 제공
    private String getCEFRLevelGuidelines(String cefrLevel) {
        return switch (cefrLevel) {
            case "A1", "A1+" -> """
                - 기본적인 일상 표현과 매우 간단한 문장 구조 사용
                - 고빈도 기초 어휘만 사용 (1000단어 이내)
                - 현재 시제 위주의 간단한 문장
                - 한 문장은 10-15단어를 넘지 않도록 함
                """;
            case "A2", "A2+" -> """
                - 일상적인 상황과 관련된 간단한 표현
                - 기본 어휘와 자주 사용되는 표현 (2000단어 이내)
                - 현재, 과거 시제의 기본적인 사용
                - 간단한 접속사를 통한 문장 연결
                """;
            case "B1", "B1+" -> """
                - 일상적인 주제에 대한 명확한 설명
                - 자주 사용되는 관용구와 연어 포함
                - 다양한 시제와 기본적인 종속절 사용
                - 3000-4000단어 수준의 어휘 사용
                """;
            case "B2", "B2+" -> """
                - 전문적이지 않은 사회적 주제 다룸
                - 다양한 연결어와 담화표지 사용
                - 가정법, 수동태 등 다양한 문법 구조
                - 5000-6000단어 수준의 어휘 사용
                """;
            case "C1", "C1+" -> """
                - 전문적인 주제와 추상적 개념 포함
                - 복잡한 문장 구조와 다양한 숙어 표현
                - 정교한 연결어와 전문 용어 사용
                - 7000-8000단어 수준의 어휘 사용
                """;
            case "C2" -> """
                - 학술적/전문적 주제의 깊이 있는 내용
                - 매우 정교한 표현과 함축적 의미 포함
                - 복잡한 구문과 고급 어휘 자유롭게 사용
                - 9000단어 이상의 고급 어휘 사용
                """;
            default -> "- 중급 수준의 어휘와 문법 구조 사용\n- 명확하고 논리적인 내용 전개\n";
        };
    }

    private String getQuestionTypeInstruction(String detailType) {
        return switch (detailType) {
            case "주제/제목 찾기" -> "지문 전체의 중심 주제나 적절한 제목을 찾는 문제를 출제하세요. 너무 포괄적이거나 좁은 주제는 피해주세요.";
            case "요지 파악" -> "글쓴이가 전달하고자 하는 핵심 메시지를 파악하는 문제를 출제하세요. 지엽적인 내용이 아닌 전체적인 요지를 물어보세요.";
            case "세부 정보 찾기" -> "지문에 명시적으로 언급된 구체적인 정보를 찾는 문제를 출제하세요. 추론이 필요한 정보는 피해주세요.";
            case "지칭 추론" -> "대명사나 지시어가 가리키는 대상을 찾는 문제를 출제하세요. 문맥상 명확히 파악할 수 있는 것만 출제하세요.";
            case "어휘 추론" -> "문맥에 적절한 어휘나 표현을 찾는 문제를 출제하세요. 해당 CEFR 레벨에 적합한 어휘를 사용하세요.";
            default -> "지문의 핵심 내용을 정확히 이해했는지 평가할 수 있는 문제를 출제하세요. 모호하거나 복수 답안이 가능한 경우는 피해주세요.";
        };
    }

    // CEFR 레벨 매핑을 위한 내부 클래스 추가
    private static class CEFRLevel {
        final String level;
        final String description;

        CEFRLevel(String level, String description) {
            this.level = level;
            this.description = description;
        }

        @Override
        public String toString() {
            return level + " - " + description;
        }
    }
}