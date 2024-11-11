import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // framer-motion 라이브러리 사용
import axios from 'axios';
import Lottie from 'react-lottie';
import CorrectAnimation from '../../assets/LottieAnimation/Correct.json';
import IncorrectAnimation from '../../assets/LottieAnimation/Incorrect.json';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const GameProgressPage = ({
                              onCorrectAnswer,
                              onWrongAnswer,
                              currentQuestion: currentQuestionNumber,
                              totalQuestions,
                              isGameOver,
                              setIsGameOver,  // 추가
                              isGameClear,
                              setIsGameClear,  // 추가
                              onRestart,
                              onMainMenu }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentQuestionNumber - 1);
    const [userAnswer, setUserAnswer] = useState('');
    const [isSliding, setIsSliding] = useState(false);
    const [slideDirection, setSlideDirection] = useState('left');
    const [feedback, setFeedback] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [hoveredAnswer, setHoveredAnswer] = useState(null);
    const [sessionIdentifier, setSessionIdentifier] = useState(null);
    // 추가할 state
    const [isTimeExpired, setIsTimeExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30분

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

    // 추가할 useEffect
    useEffect(() => {
        let timer;
        if (sessionIdentifier) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        handleTimeExpired();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [sessionIdentifier]);

    // 추가할 함수
    const handleTimeExpired = async () => {
        try {
            await api.post(`/api/answers/session/${sessionIdentifier}/complete`);
            setIsTimeExpired(true);
            setIsGameOver(true);
        } catch (error) {
            console.error('Failed to complete session:', error);
        }
    };

    // 세션 시작 함수
    const startSession = async () => {
        try {
            const response = await api.post('/api/answers/start-session', {
                userId: userId
            });
            setSessionIdentifier(response.data.sessionIdentifier);
            return response.data.sessionIdentifier;
        } catch (error) {
            console.error('Failed to start session:', error);
            throw error;
        }
    };

    // Lottie 옵션 설정
    const correctOptions = {
        loop: false,
        autoplay: true,
        animationData: CorrectAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const incorrectOptions = {
        loop: false,
        autoplay: true,
        animationData: IncorrectAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    // axios 인스턴스 생성
    const api = axios.create({
        baseURL: 'http://localhost:5173',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // sessionStorage에서 사용자 ID 가져오기
    const userId = sessionStorage.getItem('id');

    // 문제 데이터 가져오기
    // 세션 시작 및 문제 가져오기
    useEffect(() => {
        const initializeGame = async () => {
            try {
                setLoading(true);
                if (!userId) throw new Error("User ID not found in sessionStorage.");

                // 1. 활성 세션 확인
                const sessionResponse = await api.get(`/api/answers/active-session/${userId}`);
                let currentSessionId;

                if (sessionResponse.data?.sessionIdentifier) {
                    // 기존 진행 중인 세션이 있는 경우
                    currentSessionId = sessionResponse.data.sessionIdentifier;
                    // 세션 상태 확인
                    const statusResponse = await api.get(`/api/answers/session/${currentSessionId}/status`);
                    // 필요한 경우 상태 복원 로직 추가
                } else {
                    // 새 세션 시작
                    const newSessionResponse = await api.post('/api/answers/start-session', { userId });
                    currentSessionId = newSessionResponse.data.sessionIdentifier;
                }

                setSessionIdentifier(currentSessionId);

                // 2. 문제 가져오기
                const { data } = await api.get(`/api/questions/user/${userId}`);
                console.log('Raw data:', data);

                const formattedQuestions = data.map(q => {
                    if (q.questionFormat === 'MULTIPLE_CHOICE') {
                        const correctIndex = q.choices.findIndex(
                            choice => choice.choiceLabel === q.correctAnswer
                        );

                        return {
                            idx: q.idx,
                            type: 'multipleChoice',
                            question: q.question,
                            options: q.choices.map(choice => choice.choiceText),
                            correctAnswer: correctIndex,
                            passage: q.passage || null,
                            explanation: q.explanation
                        };
                    } else if (q.questionFormat === 'SHORT_ANSWER') {
                        const words = q.correctAnswer.split(' ');
                        const keywordIndex = words.findIndex(word => 
                            word.length > 3 && 
                            !['what', 'when', 'where', 'why', 'how', 'the', 'and', 'that'].includes(word.toLowerCase())
                        );
                        
                        const targetWord = words[keywordIndex];
                        const beforeWord = words.slice(0, keywordIndex).join(' ');
                        const afterWord = words.slice(keywordIndex + 1).join(' ');
                        
                        return {
                            idx: q.idx,
                            type: 'shortAnswer',
                            question: q.question,
                            correctAnswer: `${beforeWord} BLANK:${targetWord} ${afterWord}`,
                            passage: q.passage || null,
                            explanation: q.explanation
                        };
                    }
                });

                console.log('Formatted questions:', formattedQuestions);
                setQuestions(formattedQuestions);
            } catch (err) {
                console.error('Initialization error:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        initializeGame();
    }, []);

    useEffect(() => {
        const completeGame = async () => {
            if (sessionIdentifier && (isGameOver || isGameClear)) {
                try {
                    await api.post(`/api/answers/session/${sessionIdentifier}/complete`);
                } catch (error) {
                    console.error('Failed to complete session:', error);
                }
            }
        };

        completeGame();
    }, [isGameOver, isGameClear, sessionIdentifier]);

    const currentQuestion = questions[currentQuestionIndex];

    // generateHint 함수 수정
    const generateHint = (answer) => {
        if (!answer) return '';
        
        // 정답에 'BLANK:' 접두어가 있는지 확인
        if (answer.includes('BLANK:')) {
            // BLANK: 뒤의 단어를 추출하고 앞뒤 문장 분리
            const [beforeBlank, rest] = answer.split('BLANK:');
            const [blankWord, afterBlank] = rest.split(' ', 2);
            
            // 전체 문장 조합 (빈칸은 언더스코어로 대체)
            return `${beforeBlank}${'_'.repeat(blankWord.length)}${afterBlank ? ' ' + afterBlank : ''}`;
        }
        
        // 기존의 한 단어 힌트 로직
        const first = answer.slice(0, 1);
        const last = answer.slice(-1);
        const middle = '_'.repeat(answer.length - 2);
        return `${first}${middle}${last}`;
    };

    // 답안 제출 시 정답 확인 로직 수정 (handleAnswer 함수 내부)
    const handleAnswer = useCallback((answerIndex) => {
        let isCorrect = false;
        let answer;

        if (currentQuestion.type === 'multipleChoice' && currentQuestion.options && currentQuestion.options.length > answerIndex) {
            const optionsMap = ['a', 'b', 'c', 'd'];
            answer = optionsMap[answerIndex];
            isCorrect = answerIndex === currentQuestion.correctAnswer;
        } else if (currentQuestion.type === 'shortAnswer') {
            answer = answerIndex.trim();
            
            // BLANK: 형식의 정답인 경우
            if (currentQuestion.correctAnswer.includes('BLANK:')) {
                const correctBlankWord = currentQuestion.correctAnswer.split('BLANK:')[1].trim();
                isCorrect = answer.toLowerCase() === correctBlankWord.toLowerCase();
            } else {
                // 기존의 전체 문장 비교 로직
                isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
            }
        } else {
            console.error("Invalid question or choice index:", currentQuestion, answerIndex);
            return;
        }

        setSelectedAnswer(answerIndex);

        // 서버에만 정답 여부 판단을 위임
        submitAnswerToServer({
            idx: currentQuestion.idx,
            studentId: userId,
            studentAnswer: answer
        });

    }, [currentQuestion, userId, sessionIdentifier, currentQuestionNumber]);

    // 답안 제출 함수 수정
    const submitAnswerToServer = async (submitData) => {
        try {
            if (!sessionIdentifier) {
                console.error("No session identifier found");
                return;
            }

            const response = await api.post("/api/answers/submit", {
                sessionIdentifier: sessionIdentifier,
                idx: submitData.idx,
                studentId: submitData.studentId,
                studentAnswer: submitData.studentAnswer,
                questionOrder: currentQuestionNumber
            });

            const result = response.data;
            console.log("Answer submission result:", result);

            // 여기서만 정답 처리를 수행
            if (result.isCorrect) {
                onCorrectAnswer();
            } else {
                onWrongAnswer();
            }

            // UI 업데이트
            setFeedback(result.isCorrect);
            setShowFeedback(true);
            setShowAnimation(true);

            // 게임 종료 조건 체크
            if (result.completed) {
                if (result.correctCount > result.totalQuestions / 2) {
                    setIsGameClear(true);
                } else {
                    setIsGameOver(true);
                }
            }

        } catch (error) {
            if (error.response?.status === 408) {
                setIsTimeExpired(true);
                setIsGameOver(true);
                try {
                    await api.post(`/api/answers/session/${sessionIdentifier}/complete`);
                } catch (completeError) {
                    console.error("Error completing expired session:", completeError);
                }
            } else {
                console.error("Error submitting answer:", error);
                setError("Failed to submit answer");
            }
        }
    };

    // 게임 종료 시 세션 정리
    useEffect(() => {
        const completeSession = async () => {
            if (sessionIdentifier && (isGameOver || isGameClear)) {
                try {
                    await api.post(`/api/answers/session/${sessionIdentifier}/complete`);
                } catch (error) {
                    console.error('Failed to complete session:', error);
                }
            }
        };

        completeSession();
    }, [isGameOver, isGameClear, sessionIdentifier]);

    // 다음 문제로 이동하는 함수
    const handleNextQuestion = () => {
        setIsSliding(true);
        setSlideDirection('left');

        setTimeout(() => {
            // 마지막 문제인지 확인
            if (currentQuestionIndex + 1 >= questions.length) {
                api.post(`/api/answers/session/${sessionIdentifier}/complete`)
                    .catch(error => console.error('Failed to complete session:', error));
            }

            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setUserAnswer('');
            setSlideDirection('right');
            setSelectedAnswer(null);
            setShowFeedback(false);
            setShowExplanation(false);
        }, 500);

        setTimeout(() => {
            setIsSliding(false);
        }, 1000);
    };

    const renderQuestion = () => {
        if (!currentQuestion) return null;

        switch (currentQuestion.type) {
            case 'multipleChoice':
                return (
                    <div className="flex h-full w-full">
                        {/* 왼쪽 패널: 지문과 문제 */}
                        <div className="w-1/2 h-full border-r-2 border-gray-200 p-6 flex flex-col overflow-auto custom-scrollbar">
                            {/* 지문이 있는 경우 */}
                            {/* 문제 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-row justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {currentQuestion.question}
                                </h2>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="bg-transparent m-0 p-0">
                                            <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-500">
                                                Bronze-4
                                            </h2>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Bronze-4 의 난이도 입니다.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            {currentQuestion.passage && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <h3 className="text-lg kanit-semibold mb-2 text-gray-700">Passage</h3>
                                    {currentQuestion.passage.includes('A:') || currentQuestion.passage.includes('B:') ? (
                                        // 대화형 passage인 경우
                                        <div className="space-y-4">
                                            {currentQuestion.passage.split(/(?=[AB]:)/).map((line, index) => {
                                                const speaker = line.trim().startsWith('A:') ? 'A' : 'B';
                                                const content = line.replace(/^[AB]:/, '').trim();

                                                return (
                                                    <div key={index} className={`flex items-start gap-2 ${speaker === 'B' ? 'flex-row-reverse' : ''}`}>
                                                        {/* 화자 아바타 */}
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${speaker === 'A' ? 'bg-blue-500' : 'bg-green-500'
                                                            }`}>
                                                            <span className="text-white font-bold">{speaker}</span>
                                                        </div>

                                                        {/* 대화 내용 */}
                                                        <div className={`max-w-[75%] p-3 rounded-lg ${speaker === 'A'
                                                                ? 'bg-white shadow-sm rounded-tl-none border border-gray-100'
                                                                : 'bg-white shadow-sm rounded-tr-none border border-gray-100'
                                                            }`}>
                                                            <p className="kanit-regular text-lg leading-relaxed">
                                                                {content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        // 일반 passage인 경우
                                        <p className="kanit-regular text-lg text-gray-600 leading-relaxed">
                                            {currentQuestion.passage}
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* 오른쪽 패널: 선택지들 */}
                        <div className="w-1/2 h-full p-6">
                            <div className="grid grid-cols-2 gap-4 h-full">
                                {currentQuestion.options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => !showFeedback && handleAnswer(index)}
                                        onMouseEnter={() => showFeedback && selectedAnswer === index && setHoveredAnswer(index)}
                                        onMouseLeave={() => setHoveredAnswer(null)}
                                        className={`relative rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex flex-col ${showFeedback && selectedAnswer !== index ? 'cursor-not-allowed opacity-50' : ''
                                            }`}
                                        style={{
                                            backgroundColor: colors[index],
                                            minHeight: '120px',
                                            height: 'auto'
                                        }}
                                        whileHover={!showFeedback || selectedAnswer === index ? { scale: 1.02 } : {}}
                                        whileTap={!showFeedback || selectedAnswer === index ? { scale: 0.98 } : {}}
                                    >
                                        <div className="w-full h-full flex flex-col items-center justify-start p-4">
                                            <span className="text-2xl font-bold mb-2 text-white shrink-0">
                                                {['A', 'B', 'C', 'D'][index]}
                                            </span>
                                            <p className="text-lg text-white w-full px-4 overflow-y-auto max-h-[120px] custom-scrollbar">
                                                {option}
                                            </p>
                                        </div>

                                        <AnimatePresence>
                                            {showFeedback && selectedAnswer === index && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                                                    onMouseEnter={() => setHoveredAnswer(index)}
                                                    onMouseLeave={() => setHoveredAnswer(null)}
                                                >
                                                    {showAnimation && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Lottie
                                                                options={feedback ? correctOptions : incorrectOptions}
                                                                height={200}
                                                                width={200}
                                                                isClickToPauseDisabled={true}
                                                            />
                                                        </div>
                                                    )}

                                                    {hoveredAnswer === index && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className="absolute bottom-4 flex gap-4 z-50"
                                                        >
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowExplanation(true);
                                                                }}
                                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                            >
                                                                해설 기
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleNextQuestion();
                                                                }}
                                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                            >
                                                                다음 문제
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'shortAnswer':
                return (
                    <div className="flex h-full w-full">
                        {/* 왼쪽 패널: 지문과 문제 */}
                        <div className="w-1/2 h-full border-r-2 border-gray-200 p-6 flex flex-col overflow-auto custom-scrollbar">
                            {/* 문제 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-row justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {currentQuestion.question}
                                </h2>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="bg-transparent m-0 p-0">
                                            <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-500">
                                                Bronze-4
                                            </h2>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Bronze-4 의 난이도 입니다.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            {currentQuestion.passage && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <h3 className="text-lg kanit-semibold mb-2 text-gray-700">Passage</h3>
                                    {currentQuestion.passage.includes('A:') || currentQuestion.passage.includes('B:') ? (
                                        // 대화형 passage인 경우
                                        <div className="space-y-4">
                                            {currentQuestion.passage.split(/(?=[AB]:)/).map((line, index) => {
                                                const speaker = line.trim().startsWith('A:') ? 'A' : 'B';
                                                const content = line.replace(/^[AB]:/, '').trim();

                                                return (
                                                    <div key={index} className={`flex items-start gap-2 ${speaker === 'B' ? 'flex-row-reverse' : ''}`}>
                                                        {/* 화자 아바타 */}
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${speaker === 'A' ? 'bg-blue-500' : 'bg-green-500'
                                                            }`}>
                                                            <span className="text-white font-bold">{speaker}</span>
                                                        </div>

                                                        {/* 대화 내용 */}
                                                        <div className={`max-w-[75%] p-3 rounded-lg ${speaker === 'A'
                                                                ? 'bg-white shadow-sm rounded-tl-none border border-gray-100'
                                                                : 'bg-white shadow-sm rounded-tr-none border border-gray-100'
                                                            }`}>
                                                            <p className="kanit-regular text-lg leading-relaxed">
                                                                {content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        // 일반 passage인 경우
                                        <p className="kanit-regular text-lg text-gray-600 leading-relaxed">
                                            {currentQuestion.passage}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 오른쪽 패널: 답안 입력 */}
                        <div className="w-1/2 h-full p-6 flex flex-col items-center justify-center relative">
                            <div className="w-full max-w-md">
                                {/* 힌트 표시 */}
                                <div className="text-center mb-4">
                                    <p className="text-2xl font-mono tracking-wider">
                                        {generateHint(currentQuestion.correctAnswer)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Fill in the blank with the correct answer
                                    </p>
                                </div>

                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAnswer(userAnswer)}
                                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg mb-4 focus:border-blue-500 focus:outline-none text-center font-mono tracking-wider"
                                    placeholder="Type your answer..."
                                    disabled={showFeedback}
                                    maxLength={currentQuestion.correctAnswer.length}
                                />

                                <motion.button
                                    onClick={() => handleAnswer(userAnswer)}
                                    className="w-full p-4 bg-blue-500 text-white rounded-lg text-lg font-semibold"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={showFeedback}
                                >
                                    Submit
                                </motion.button>

                                <AnimatePresence>
                                    {showFeedback && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                            onMouseEnter={() => setHoveredAnswer(true)}
                                            onMouseLeave={() => setHoveredAnswer(false)}
                                        >
                                            <div className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center`}>
                                                {showAnimation && (
                                                    <div className="mb-4">
                                                        <Lottie
                                                            options={feedback ? correctOptions : incorrectOptions}
                                                            height={200}
                                                            width={200}
                                                            isClickToPauseDisabled={true}
                                                        />
                                                    </div>
                                                )}

                                                {/* 호버 시 나타나는 버튼들 */}
                                                {hoveredAnswer && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="flex gap-4 mt-4"
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowExplanation(true);
                                                            }}
                                                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
                                                        >
                                                            해설 보기
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleNextQuestion();
                                                            }}
                                                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
                                                        >
                                                            다음 문제
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-600 text-xl mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isGameOver) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full"
            >
                <h2 className="text-4xl font-bold text-red-600 mb-8">Game Over</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={onRestart}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/main')}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Main Menu
                    </button>
                </div>
            </motion.div>
        );
    }


    if (isGameClear) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full"
            >
                <h2 className="text-4xl font-bold text-green-600 mb-8">Game Clear!</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={onRestart}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Play Again
                    </button>
                    <button
                        onClick={() => navigate('/main')}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Main Menu
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="h-full w-full overflow-visible bg-gray-50 relative">
            <motion.div
                className="flex h-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 1.2,
                    ease: "easeOut"
                }}
            >
                <div className="flex-1">
                    {renderQuestion()}
                </div>

                {/* 해설 모달 */}
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-visible"
                            onClick={() => setShowExplanation(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: -20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                                className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 absolute top-[-50%] transform -translate-x-1/2"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-xl text-gray-700">💡 해설</h4>
                                    <button
                                        onClick={() => setShowExplanation(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-lg text-gray-600 leading-relaxed">
                                    <p className="whitespace-pre-line break-words">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default GameProgressPage;
