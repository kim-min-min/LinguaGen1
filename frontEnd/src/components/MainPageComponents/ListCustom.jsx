import React, { useState, useCallback, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Player } from '@lottiefiles/react-lottie-player';
import ClickAnimation from '../../assets/LottieAnimation/ClickAnimation.json';
import FatiguePopup from './FatiguePopup';
import { useNavigate } from 'react-router-dom';
import DungeonCanvas from '../Game/DungeonCanvas';
import RuinsCanvas from '../Game/RuinsCanvas';
import MountainCanvas from '../Game/MountainCanvas';
import useStore from '../../store/useStore';

const ListCustom = () => {
  const { increaseFatigue, fatigue } = useStore();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 });
  const [showFatiguePopup, setShowFatiguePopup] = useState(false);
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [canvasValue, setCanvasValue] = useState(null);

  // canvases 배열 추가
  const canvases = [DungeonCanvas, RuinsCanvas, MountainCanvas];

  // 더미 데이터 확장
  const customQuestions = [
    {
      id: 1,
      theme: 'Grammar',
      title: 'Past Perfect Tense Practice',
      date: '2024-03-20',
      difficulty: 'Medium',
      questionCount: 5,
      questions: Array.from({ length: 5 }, (_, i) => i + 1)
    },
    {
      id: 2,
      theme: 'Vocabulary',
      title: 'Business Terms Quiz',
      date: '2024-03-19',
      difficulty: 'Hard',
      questionCount: 10,
      questions: Array.from({ length: 10 }, (_, i) => i + 6)
    },
    {
      id: 3,
      theme: 'Reading',
      title: 'Academic Reading Comprehension',
      date: '2024-03-18',
      difficulty: 'Advanced',
      questionCount: 15,
      questions: Array.from({ length: 15 }, (_, i) => i + 16)
    },
    {
      id: 4,
      theme: 'Listening',
      title: 'TOEIC Listening Practice',
      date: '2024-03-17',
      difficulty: 'Hard',
      questionCount: 5,
      questions: Array.from({ length: 5 }, (_, i) => i + 31)
    },
    {
      id: 5,
      theme: 'Speaking',
      title: 'Business Presentation Skills',
      date: '2024-03-16',
      difficulty: 'Advanced',
      questionCount: 10,
      questions: Array.from({ length: 10 }, (_, i) => i + 36)
    },
    {
      id: 6,
      theme: 'Writing',
      title: 'Essay Writing Practice',
      date: '2024-03-15',
      difficulty: 'Medium',
      questionCount: 5,
      questions: Array.from({ length: 5 }, (_, i) => i + 46)
    },
    {
      id: 7,
      theme: 'Grammar',
      title: 'Conditional Sentences',
      date: '2024-03-14',
      difficulty: 'Hard',
      questionCount: 15,
      questions: Array.from({ length: 15 }, (_, i) => i + 51)
    },
    {
      id: 8,
      theme: 'Vocabulary',
      title: 'Academic Word List',
      date: '2024-03-13',
      difficulty: 'Advanced',
      questionCount: 10,
      questions: Array.from({ length: 10 }, (_, i) => i + 66)
    }
  ];

  const handleQuestionSelect = (question) => {
    setSelectedQuestions(prev => {
      // 이미 선택된 문제 세트인 경우 제거
      if (prev.some(id => question.questions.includes(id))) {
        return prev.filter(id => !question.questions.includes(id));
      }

      // 새로운 문제 세트를 추가할 때 15개 제한 확인
      const newQuestions = [...prev, ...question.questions];
      if (newQuestions.length <= 15) {
        return newQuestions;
      }
      return prev;
    });
  };

  const handleButtonClick = (e) => {
    // 15개 미만 선택시 게임 시작 불가
    if (selectedQuestions.length < 15) return;
    
    // 피로도가 100%일 때
    if (fatigue >= 100) {
      setShowFatiguePopup(true);
      return;
    }

    if (showAnimation || isExiting) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    setAnimationPosition({
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2
    });

    setShowAnimation(true);
    setIsExiting(false);

    setTimeout(() => {
      setShowAnimation(false);
      setIsExiting(true);
      
      setTimeout(() => {
        handleStartGame();
      }, 500);
    }, 1000);
  };

  const handleStartGame = useCallback(async () => {
    try {
      // 피로도 5 증가
      increaseFatigue(5);

      const randomCanvas = canvases[Math.floor(Math.random() * canvases.length)];
      setCanvasValue(randomCanvas);

      // 상태 초기화
      setShowAnimation(false);
      setIsExiting(false);
      setAnimationPosition({ x: 0, y: 0 });

      navigate('/loading');

      const timer = setTimeout(() => {
        if (randomCanvas === DungeonCanvas) {
          navigate('/dungeon');
        } else if (randomCanvas === MountainCanvas) {
          navigate('/mountain');
        } else if (randomCanvas === RuinsCanvas) {
          navigate('/ruins');
        }
      }, 3000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }, [navigate, increaseFatigue]);

  return (
    <div className="p-6 space-y-6 h-screen flex flex-col overflow-hidden">
      <div className="space-y-2 flex flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Custom Questions</h2>
          <p className="text-gray-500">View and manage your custom-generated questions.</p>
          <p className="text-sm text-gray-400">
            {selectedQuestions.length}/15 문제 선택됨
          </p>
        </div>
        <div className="mr-8">
          <Button
            onClick={handleButtonClick}
            className="w-30 h-12 text-white rounded-md font-bold text-xl hover:scale-125 transition-all duration-500 jua-regular"
            disabled={showAnimation || isExiting || selectedQuestions.length < 15}
          >
            게임 시작하기
          </Button>
        </div>
      </div>

      {/* 스크롤 가능한 영역 추가 */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid gap-4 pb-20">
          {customQuestions.map((question) => (
            <Card
              key={question.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${selectedQuestions.some(id => question.questions.includes(id))
                  ? 'border-2 border-blue-500'
                  : ''
                }`}
              onClick={() => handleQuestionSelect(question)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{question.title}</CardTitle>
                    <CardDescription>Created on {question.date}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">{question.theme}</Badge>
                    <Badge variant="secondary">{question.questionCount}문제</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{question.difficulty}</Badge>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showAnimation && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: animationPosition.x - 100,
            top: animationPosition.y - 100,
            width: '200px',
            height: '200px',
            zIndex: 100
          }}
        >
          <Player
            ref={playerRef}
            autoplay
            keepLastFrame={false}
            src={ClickAnimation}
            style={{ width: '200px', height: '200px' }}
            onComplete={() => {
              setShowAnimation(false);
            }}
          />
        </div>
      )}

      {showFatiguePopup && (
        <FatiguePopup onClose={() => setShowFatiguePopup(false)} />
      )}
    </div>
  );
};

export default ListCustom; 