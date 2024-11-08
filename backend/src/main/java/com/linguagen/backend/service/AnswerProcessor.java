package com.linguagen.backend.service;

import com.linguagen.backend.dto.AnswerResponse;
import com.linguagen.backend.entity.Question;
import com.linguagen.backend.entity.StudentAnswer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnswerProcessor {
    private final QuestionService questionService;

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
        } else {
            String correctAnswerText = question.getChoices().stream()
                .filter(c -> c.getChoiceLabel().equalsIgnoreCase(correctLabel))
                .findFirst()
                .map(c -> c.getChoiceText())
                .orElse("");
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
        } else {
            answer.setFeedback("오답입니다. 정답은 '" + correctAnswer + "' 입니다.");
        }
    }
}