"use client"

import React, { useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import '../App.css';
import GoodbyeMessage from './GoodbyeMessage';
import useStore from '../store/useStore';

function DemoPlay() {
  // zustand에서 상태 가져오기
  const {
    progress,
    currentQuestion,
    answers,
    showResult,
    isFinishing,
    fadeIn,
    fadeOut,
    showGoodbyeMessage,
    setFadeIn,
    setFadeOut,
    handleNext,
    handleBack,
    handleAnswerChange,
    handleCheckAnswer,
    handleFinish, // zustand에서 가져온 handleFinish 함수
    startFinishingProcess,
    setShowGoodbyeMessage, // zustand에서 showGoodbyeMessage 설정 함수 가져오기
  } = useStore();

  // 문제 리스트 정의
  const questions = [
    {
      type: 'multiple',
      question: "What is the capital of France?",
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
    },
    {
      type: 'multiple',
      question: "Which planet is known as the Red Planet?",
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
    },
    {
      type: 'multiple',
      question: "Who painted the Mona Lisa?",
      options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
      correctAnswer: 'Leonardo da Vinci',
    },
    {
      type: 'fillBlank',
      question: "The largest ocean on Earth is the _______ Ocean.",
      correctAnswer: 'Pacific',
    },
    {
      type: 'fillBlank',
      question: "The chemical symbol for gold is _______.",
      correctAnswer: 'Au',
    },
  ];

  // 페이지가 로드될 때 fadeIn 처리
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 500);
  }, []);

  // isFinishing이 true일 때, 상태 관리 로직을 실행
  useEffect(() => {
    if (isFinishing) {
      const interval = setInterval(() => {
        startFinishingProcess();
      }, 10);

      // 진행률이 100%에 도달하면 goodbyeMessage를 보여줌
      if (progress >= 100) {
        setFadeOut(true);
        setTimeout(() => {
          setShowGoodbyeMessage(true); // GoodbyeMessage를 표시
        }, 1000);
      }

      return () => clearInterval(interval);
    }
  }, [isFinishing, progress, startFinishingProcess, setShowGoodbyeMessage]);

  // 질문 렌더링 함수
  const renderQuestion = () => {
    const question = questions[currentQuestion];
    if (question.type === 'multiple') {
      return (
        <div className="options-grid">
          {question.options.map((option, index) => (
            <Card
              key={index}
              className={`InterRegular option ${answers[currentQuestion] === option ? 'selected' : ''} ${showResult && option === question.correctAnswer ? 'correct' : ''} ${showResult && answers[currentQuestion] === option && option !== question.correctAnswer ? 'incorrect' : ''}`}
              onClick={() => !showResult && handleAnswerChange(option)}
            >
              <span className="option-text">{option}</span>
            </Card>
          ))}
        </div>
      );
    } else if (question.type === 'fillBlank') {
      const parts = question.question.split('_______');
      return (
        <div className="fill-blank-container">
          <div className="question-content">
            {parts[0]}
            <input
              type="text"
              className="fill-blank-input"
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
            {parts[1]}
          </div>
          {showResult && (
            <div className={`result ${answers[currentQuestion].toLowerCase() === question.correctAnswer.toLowerCase() ? 'correct' : 'incorrect'}`}>
              {answers[currentQuestion].toLowerCase() === question.correctAnswer.toLowerCase() ? 'Correct!' : `Incorrect. The correct answer is ${question.correctAnswer}.`}
            </div>
          )}
        </div>
      );
    }
  };

  // showGoodbyeMessage 상태에 따라 GoodbyeMessage 컴포넌트를 렌더링
  if (showGoodbyeMessage) {
    return <GoodbyeMessage />;
  }

  return (
    <div className={`demo-play-container ${fadeIn ? 'fade-in' : ''} ${fadeOut ? 'fade-out' : ''}`}>
      <div className="header-container">
        <header className="demo-header">
          <Progress value={progress} className="w-full justify-center" />
        </header>
      </div>
      <main className="demo-main">
        <div className="content-container">
          <h2 className="question-title InterBold">Question {currentQuestion + 1}</h2>
          <div className="question-content">
            {questions[currentQuestion].type === 'multiple' ? questions[currentQuestion].question : ''}
          </div>
          <div className="answer-content">
            {renderQuestion()}
          </div>
          <Button
            onClick={handleCheckAnswer}
            className="check-answer-button"
            disabled={showResult || answers[currentQuestion] === ''}
          >
            정답 확인
          </Button>
          {showResult && (
            <div className={`result ${answers[currentQuestion] === questions[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}`}>
              {answers[currentQuestion] === questions[currentQuestion].correctAnswer ? '정답입니다!' : `오답입니다. 정답은 ${questions[currentQuestion].correctAnswer}입니다.`}
            </div>
          )}
        </div>
      </main>
      <footer className="demo-footer">
        <Separator className="mb-4" />
        <div className="navigation-buttons">
          <Button onClick={handleBack} disabled={currentQuestion === 0 || isFinishing}>Back</Button>
          <Button onClick={currentQuestion === questions.length - 1 ? handleFinish : handleNext} disabled={isFinishing}>
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default DemoPlay;
