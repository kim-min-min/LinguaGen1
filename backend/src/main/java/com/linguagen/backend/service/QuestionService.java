package com.linguagen.backend.service;

import com.linguagen.backend.dto.QuestionDTO;
import com.linguagen.backend.entity.Choices;
import com.linguagen.backend.entity.Question;
import com.linguagen.backend.exception.ResourceNotFoundException;
import com.linguagen.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    // 모든 문제 조회
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionRepository.findAllWithChoices();
        return questions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // 타입별 문제 조회
    public List<QuestionDTO> getQuestionsByType(String type) {
        List<Question> questions = questionRepository.findByTypeWithChoices(type);
        return questions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // 난이도별 문제 조회
    public List<QuestionDTO> getQuestionsByDifficulty(Byte grade, Byte tier) {
        List<Question> questions = questionRepository.findByDiffGradeAndDiffTierWithChoices(grade, tier);
        return questions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // 관심사별 문제 조회
    public List<QuestionDTO> getQuestionsByInterest(String interest) {
        List<Question> questions = questionRepository.findByInterestWithChoices(interest);
        return questions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // 랜덤 문제 조회
    public List<QuestionDTO> getRandomQuestions(int count) {
        List<Question> questions = questionRepository.findRandomQuestions(count);
        return questions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // ID로 단일 문제 조회
    public QuestionDTO getQuestionById(Long idx) {
        Question question = questionRepository.findByIdWithChoices(idx)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Question not found with id: " + idx));
        return convertToDTO(question);
    }

    // Entity를 DTO로 변환
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setIdx(question.getIdx());
        dto.setType(question.getType());
        dto.setDetailType(question.getDetailType());
        dto.setInterest(question.getInterest());
        dto.setDiffGrade(question.getDiffGrade());
        dto.setDiffTier(question.getDiffTier());
        dto.setQuestionFormat(question.getQuestionFormat());
        dto.setPassage(question.getPassage());
        dto.setQuestion(question.getQuestion());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setExplanation(question.getExplanation());

        List<QuestionDTO.ChoicesDTO> choicesDTOs = question.getChoices().stream()
            .map(this::convertChoiceToDTO)
            .collect(Collectors.toList());
        dto.setChoices(choicesDTOs);

        return dto;
    }

    // Choice Entity를 DTO로 변환
    private QuestionDTO.ChoicesDTO convertChoiceToDTO(Choices choice) {
        return new QuestionDTO.ChoicesDTO(
            choice.getIdx(),
            choice.getChoiceLabel(),
            choice.getChoiceText()
        );
    }

    public List<QuestionDTO> getQuestionsByDifficultyWithCount(Byte grade, Byte tier, int count) {
        // 해당 난이도의 문제들을 무작위로 count개 만큼 가져옴
        List<Question> questions = questionRepository.findRandomQuestionsByDifficulty(grade, tier, count);
        return questions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}

