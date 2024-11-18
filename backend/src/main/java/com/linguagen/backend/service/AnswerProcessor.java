package com.linguagen.backend.service;

import com.linguagen.backend.dto.AnswerResponse;
import com.linguagen.backend.entity.Question;
import com.linguagen.backend.entity.StudentAnswer;
import com.linguagen.backend.entity.Grade;
import com.linguagen.backend.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnswerProcessor {

    private final QuestionService questionService;
    private final GradeRepository gradeRepository; // GradeRepository 추가

    // 학생의 grade 조회
    public int getStudentGrade(String userId) {
        Grade grade = gradeRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자의 grade 정보를 찾을 수 없습니다: " + userId));
        return grade.getGrade(); // grade 값 반환
    }

    // 학생의 tier 조회
    public int getStudentTier(String userId) {
        Grade grade = gradeRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자의 tier 정보를 찾을 수 없습니다: " + userId));
        return grade.getTier(); // tier 값 반환
    }

    @Transactional
    public void processAnswer(StudentAnswer answer) {
        Question question = answer.getQuestion();
        String studentAnswer = answer.getStudentAnswer();

        if (question.getQuestionFormat() == Question.QuestionFormat.MULTIPLE_CHOICE) {
            processMultipleChoiceAnswer(answer, question);
        } else {
            processShortAnswer(answer, question);
        }
    }

    private void processMultipleChoiceAnswer(StudentAnswer answer, Question question) {
        String correctLabel = question.getCorrectAnswer();
        String studentLabel = answer.getStudentAnswer();

        boolean isCorrect = correctLabel.equalsIgnoreCase(studentLabel);
        answer.setIsCorrect(isCorrect ? 1 : 0);

        if (isCorrect) {
            answer.setFeedback("정답입니다!");

            // 등급 정보 조회 및 점수 계산
            int studentGrade = getStudentGrade(answer.getStudentId());
            int questionGrade = question.getDiffGrade();
            int studentTier = getStudentTier(answer.getStudentId());
            int questionTier = question.getDiffTier();

            int scoreToAdd;
            if (questionGrade > studentGrade || questionTier < studentTier) {
                scoreToAdd = 3; // 높은 등급 문제를 맞춘 경우
            } else if (questionGrade == studentGrade && questionTier == studentTier) {
                scoreToAdd = 2; // 동일 등급 문제를 맞춘 경우
            } else {
                scoreToAdd = 1; // 낮은 등급 문제를 맞춘 경우
            }
            // 점수를 StudentAnswer에 설정
            answer.setScore(scoreToAdd);

        } else {
            String correctAnswerText = question.getChoices().stream()
                    .filter(c -> c.getChoiceLabel().equalsIgnoreCase(correctLabel))
                    .findFirst()
                    .map(c -> c.getChoiceText())
                    .orElse("");
            // 점수를 StudentAnswer에 설정
            answer.setScore(0);
            answer.setFeedback("오답입니다. 정답은 " + correctLabel + ") " + correctAnswerText + " 입니다.");
        }
    }

    private void processShortAnswer(StudentAnswer answer, Question question) {
        String correctAnswer = question.getCorrectAnswer();
        String studentAnswer = answer.getStudentAnswer().trim();

        boolean isCorrect = correctAnswer.equalsIgnoreCase(studentAnswer);
        answer.setIsCorrect(isCorrect ? 1 : 0);

        if (isCorrect) {
            answer.setFeedback("정답입니다!");

            // 등급 정보 조회 및 점수 계산
            int studentGrade = getStudentGrade(answer.getStudentId());
            int questionGrade = question.getDiffGrade();
            int studentTier = getStudentTier(answer.getStudentId());
            int questionTier = question.getDiffTier();

            int scoreToAdd;
            if (questionGrade > studentGrade || questionTier < studentTier) {
                scoreToAdd = 3; // 높은 등급 문제를 맞춘 경우
            } else if (questionGrade == studentGrade && questionTier == studentTier) {
                scoreToAdd = 2; // 동일 등급 문제를 맞춘 경우
            } else {
                scoreToAdd = 1; // 낮은 등급 문제를 맞춘 경우
            }

            // 점수를 StudentAnswer에 설정
            answer.setScore(scoreToAdd);

        } else {
            answer.setFeedback("오답입니다. 정답은 '" + correctAnswer + "' 입니다.");
            // 점수를 StudentAnswer에 설정
            answer.setScore(0); // 오답일 경우 점수는 0
        }
    }

}
