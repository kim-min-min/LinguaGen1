import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // framer-motion 라이브러리 사용
import axios from 'axios';
import TutorialMessage from './TutorialMessage';
import Lottie from 'react-lottie';
import CorrectAnimation from '../../assets/LottieAnimation/Correct.json';
import IncorrectAnimation from '../../assets/LottieAnimation/Incorrect.json';
import EndingMessage from './EndingMessage';

const GameProgressPage = ({ onCorrectAnswer, onWrongAnswer, currentQuestion: currentQuestionNumber, totalQuestions, isGameOver, isGameClear, onRestart, onMainMenu, setIsHighlightingHealthBar, setIsHighlightingSoundButton }) => {
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
    const [showTutorial, setShowTutorial] = useState(true);
    const [showAnimation, setShowAnimation] = useState(false);
    const [hoveredAnswer, setHoveredAnswer] = useState(null);
    const [showEndingMessage, setShowEndingMessage] = useState(false);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

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

    // 문제 데이터 가져오기
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/questions/difficulty?grade=1&tier=4&count=10`, {
                    params: {
                        count: 10
                    },
                    headers: {
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });

                console.log('Raw data:', data);

                const formattedQuestions = data.map(q => {
                    if (q.questionFormat === 'MULTIPLE_CHOICE') {
                        const correctIndex = q.choices.findIndex(
                            choice => choice.choiceLabel === q.correctAnswer
                        );

                        return {
                            type: 'multipleChoice',
                            question: q.question,
                            options: q.choices.map(choice => choice.choiceText),
                            correctAnswer: correctIndex,
                            passage: q.passage || null,
                            explanation: q.explanation
                        };
                    } else if (q.questionFormat === 'SHORT_ANSWER') {
                        return {
                            type: 'shortAnswer',
                            question: q.question,
                            correctAnswer: q.correctAnswer,
                            passage: q.passage || null,
                            explanation: q.explanation
                        };
                    }
                    return null;
                }).filter(q => q !== null);

                console.log('Formatted questions:', formattedQuestions);
                setQuestions(formattedQuestions);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = useCallback((answer) => {
        if (showFeedback) return;

        let isCorrect = false;
        if (currentQuestion.type === 'multipleChoice') {
            isCorrect = answer === currentQuestion.correctAnswer;
        } else if (currentQuestion.type === 'shortAnswer') {
            isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
        }

        setSelectedAnswer(answer);
        setFeedback(isCorrect);
        setShowFeedback(true);
        setShowAnimation(true);

        if (isCorrect) {
            onCorrectAnswer();
        } else {
            onWrongAnswer();
        }
    }, [currentQuestion, onCorrectAnswer, onWrongAnswer, showFeedback]);

    // 다음 문제로 이동하는 함수
    const handleNextQuestion = () => {
        setIsSliding(true);
        setSlideDirection('left');

        setTimeout(() => {
            setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
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
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h2>
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
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                            speaker === 'A' ? 'bg-blue-500' : 'bg-green-500'
                                                        }`}>
                                                            <span className="text-white font-bold">{speaker}</span>
                                                        </div>
                                                        
                                                        {/* 대화 내용 */}
                                                        <div className={`max-w-[75%] p-3 rounded-lg ${
                                                            speaker === 'A' 
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
                                        className={`relative h-full rounded-lg shadow-md transition-all duration-300 hover:shadow-lg h-32 flex flex-col ${
                                            showFeedback && selectedAnswer !== index ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                        style={{
                                            backgroundColor: colors[index],
                                        }}
                                        whileHover={!showFeedback || selectedAnswer === index ? {scale: 1.02} : {}}
                                        whileTap={!showFeedback || selectedAnswer === index ? {scale: 0.98} : {}}
                                    >
                                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                                            <span className="text-2xl font-bold mb-2 text-white">
                                                {['A', 'B', 'C', 'D'][index]}
                                            </span>
                                            <p className="text-lg text-white w-full px-4">
                                                {option}
                                            </p>
                                        </div>
                                        
                                        <AnimatePresence>
                                            {showFeedback && selectedAnswer === index && (
                                                <motion.div
                                                    initial={{opacity: 0}}
                                                    animate={{opacity: 1}}
                                                    exit={{opacity: 0}}
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
                                                                해설 보기
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
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h2>
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
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                            speaker === 'A' ? 'bg-blue-500' : 'bg-green-500'
                                                        }`}>
                                                            <span className="text-white font-bold">{speaker}</span>
                                                        </div>
                                                        
                                                        {/* 대화 내용 */}
                                                        <div className={`max-w-[75%] p-3 rounded-lg ${
                                                            speaker === 'A' 
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
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAnswer(userAnswer)}
                                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg mb-4 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter your answer..."
                                    disabled={showFeedback}
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

    const handleStart = () => {
        setShowTutorial(false);
    };

    // isGameOver나 isGameClear가 변경될 때 엔딩 메시지 표시
    useEffect(() => {
        if (isGameOver || isGameClear) {
            setShowEndingMessage(true);
        }
    }, [isGameOver, isGameClear]);

    const handleEndingFinish = () => {
        navigate('/main');
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
        return showEndingMessage ? (
            <EndingMessage isGameClear={false} onFinish={handleEndingFinish} />
        ) : null;
    }

    if (isGameClear) {
        return showEndingMessage ? (
            <EndingMessage isGameClear={true} onFinish={handleEndingFinish} />
        ) : null;
    }

    return (
        <div className="h-full w-full overflow-visible bg-gray-50 relative">
            {showTutorial ? (
                <TutorialMessage 
                    onStart={handleStart}
                    setIsHighlightingHealthBar={setIsHighlightingHealthBar}
                    setIsHighlightingSoundButton={setIsHighlightingSoundButton}
                />
            ) : (
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
            )}
        </div>
    );
};

export default GameProgressPage;
