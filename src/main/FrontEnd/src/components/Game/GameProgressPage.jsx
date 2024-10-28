import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // framer-motion 라이브러리 사용


// const questions = [
//     // 4지선다 문법 문제
//     {
//         type: 'multipleChoice',
//         question: "Which sentence is grammatically correct?",
//         options: ["I have been to Paris last year.", "I went to Paris last year.", "I have gone to Paris last year.", "I had been going to Paris last year."],
//         correctAnswer: 1
//     },
//     // 4지선다 어휘 문제
//     {
//         type: 'multipleChoice',
//         question: "What's the meaning of 'ubiquitous'?",
//         options: ["Rare", "Everywhere", "Unique", "Transparent"],
//         correctAnswer: 1
//     },
//     // 4지선다 독해 문제
//     {
//         type: 'multipleChoice',
//         question: "Based on the passage: The cat sat on the mat. It was purring loudly. What can we infer?",
//         options: ["The cat was angry", "The cat was content", "The cat was hungry", "The cat was sleeping"],
//         correctAnswer: 1
//     },
//     // 빈칸 ���우기 문제 1
//     {
//         type: 'fillInTheBlank',
//         question: "The sun _____ in the east and sets in the west.",
//         answer: "rises"
//     },
//     // 빈칸 채우기 문제 2
//     {
//         type: 'fillInTheBlank',
//         question: "Water _____ at 100 degrees Celsius at sea level.",
//         answer: "boils"
//     },
//     // 빈칸 채우 문제 3
//     {
//         type: 'fillInTheBlank',
//         question: "The Earth _____ around the Sun.",
//         answer: "revolves"
//     },
//     // 빈칸 채우기 문제 4
//     {
//         type: 'fillInTheBlank',
//         question: "Photosynthesis is the process by which plants make their own _____.",
//         answer: "food"
//     },
//     // 리스닝 문제 1
//     {
//         type: 'listening',
//         audioSrc: 'path/to/audio1.mp3',
//         question: "What did the speaker say about the weather?",
//         options: ["It's going to rain", "It's going to be sunny", "It's going to snow", "It's going to be windy"],
//         correctAnswer: 0
//     },
//     // 리스닝 문제 2
//     {
//         type: 'listening',
//         audioSrc: 'path/to/audio2.mp3',
//         question: "What time did the speaker say the meeting starts?",
//         options: ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
//         correctAnswer: 2
//     },
//     // 리스닝 문제 3
//     {
//         type: 'listening',
//         audioSrc: 'path/to/audio3.mp3',
//         question: "What is the main topic of the conversation?",
//         options: ["Weather", "Politics", "Sports", "Education"],
//         correctAnswer: 3
//     }
// ];

const GameProgressPage = ({ onCorrectAnswer, onWrongAnswer, currentQuestion: currentQuestionNumber, totalQuestions, isGameOver, isGameClear, onRestart, onMainMenu }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentQuestionNumber - 1);
    const [userAnswer, setUserAnswer] = useState('');
    const [isSliding, setIsSliding] = useState(false);
    const [slideDirection, setSlideDirection] = useState('left');
    const [gameOverAnimation, setGameOverAnimation] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showNextButtons, setShowNextButtons] = useState(false);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

    // 문제 데이터 가져오기
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5173/api/questions/random?count=10');

                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }

                const data = await response.json();
                console.log('Raw data:', data);

                // 데이터 변환 부분
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
                    } else if (q.questionFormat === 'SHORT_ANSWER') {  // SHORT_ANSWER 케이스 처리
                        return {
                            type: 'shortAnswer',
                            question: q.question,
                            correctAnswer: q.correctAnswer,
                            passage: q.passage || null,
                            explanation: q.explanation
                        };
                    }
                });


                console.log('Formatted questions:', formattedQuestions);
                setQuestions(formattedQuestions);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = useCallback((answer) => {
        let isCorrect = false;
        if (currentQuestion.type === 'multipleChoice') {
            isCorrect = answer === currentQuestion.correctAnswer;
        } else if (currentQuestion.type === 'shortAnswer') {
            isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
        }

        setSelectedAnswer(answer);
        setFeedback(isCorrect);
        setShowFeedback(true);
        setShowNextButtons(true); // 답안 제출 후 버튼들 표시

        if (isCorrect) {
            onCorrectAnswer();
        } else {
            onWrongAnswer();
        }
    }, [currentQuestion, onCorrectAnswer, onWrongAnswer]);

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
            setShowNextButtons(false);
        }, 500);

        setTimeout(() => {
            setIsSliding(false);
        }, 1000);
    };

// 해설 및 다음 문제 버튼 컴포넌트
    const renderNextButtons = () => {
        if (!showNextButtons) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg"
            >
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex-1">
                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {showExplanation ? '해설 닫기' : '해설 보기'}
                        </button>
                    </div>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-2 px-6 text-gray-700"
                        >
                            <h3 className="font-bold mb-2">해설:</h3>
                            <p>{currentQuestion.explanation}</p>
                        </motion.div>
                    )}
                    <div className="flex-1 text-right">
                        <button
                            onClick={handleNextQuestion}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            다음 문제
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };



    const renderQuestion = () => {
        if (!currentQuestion) return null;

        switch (currentQuestion.type) {
            case 'multipleChoice':
                return (
                    <div className="flex h-full w-full">
                        {/* 왼쪽 패널: 지문과 문제 */}
                        <div className="w-1/3 h-full border-r-2 border-gray-200 p-6 flex flex-col overflow-auto">
                            {/* 지문이 있는 경우 */}
                            {currentQuestion.passage && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Passage</h3>
                                    <p className="text-base text-gray-600 leading-relaxed">{currentQuestion.passage}</p>
                                </div>
                            )}
                            {/* 문제 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h2>
                            </div>
                        </div>

                        {/* 오른쪽 패널: 선택지들 */}
                        <div className="w-2/3 h-full p-6">
                            <div className="grid grid-cols-2 gap-6 h-full">
                                {currentQuestion.options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleAnswer(index)}
                                        className="relative rounded-lg shadow-md transition-all duration-300 hover:shadow-lg h-32 flex flex-col"
                                        style={{
                                            backgroundColor: colors[index],
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                    <span className="text-2xl font-bold mb-3 text-white">
                        {['A', 'B', 'C', 'D'][index]}
                    </span>
                                            <p className="text-lg text-white w-full px-4">
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
                                                >
                            <span className="text-6xl font-bold text-white">
                                {feedback ? 'O' : 'X'}
                            </span>
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
                        <div className="w-1/3 h-full border-r-2 border-gray-200 p-6 flex flex-col overflow-auto">
                            {/* 지문이 있는 경우 */}
                            {currentQuestion.passage && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Passage</h3>
                                    <p className="text-base text-gray-600 leading-relaxed">{currentQuestion.passage}</p>
                                </div>
                            )}
                            {/* 문제 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h2>
                            </div>
                        </div>

                        {/* 오른쪽 패널: 답안 입력 */}
                        <div className="w-2/3 h-full p-6 flex flex-col items-center justify-center">
                            <div className="w-full max-w-md">
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAnswer(userAnswer)}
                                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg mb-4 focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter your answer..."
                                />
                                <motion.button
                                    onClick={() => handleAnswer(userAnswer)}
                                    className="w-full p-4 bg-blue-500 text-white rounded-lg text-lg font-semibold"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Submit
                                </motion.button>

                                <AnimatePresence>
                                    {showFeedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`mt-4 p-4 rounded-lg text-center text-white text-xl font-bold ${
                                                feedback ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                        >
                                            {feedback ? 'Correct!' : 'Incorrect!'}
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
        <div className="h-full w-full overflow-hidden bg-gray-50 relative">
            {renderQuestion()}
            {renderNextButtons()}
        </div>
    );
};

export default GameProgressPage;
