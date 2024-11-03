import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // framer-motion 라이브러리 사용
import axios from 'axios';


const GameProgressPage = ({ onCorrectAnswer, onWrongAnswer, currentQuestion: currentQuestionNumber, totalQuestions, isGameOver, isGameClear, onRestart, onMainMenu }) => {
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
    const [showNextButtons, setShowNextButtons] = useState(false);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];



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
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);

                if (!userId) throw new Error("User ID not found in sessionStorage.");

                const { data } = await api.get(`/api/questions/user/${userId}`);
                console.log('Raw data:', data);

                // 데이터 변환 부분에 idx 추가
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
                        return {
                            idx: q.idx,
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
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = useCallback((answerIndex) => {
        let isCorrect = false;
        let answer;  // 서버로 보낼 선택지 레이블 ('a', 'b', 'c', 'd')

        if (currentQuestion.type === 'multipleChoice' && currentQuestion.options && currentQuestion.options.length > answerIndex) {
            // 인덱스를 a, b, c, d와 매핑
            const optionsMap = ['a', 'b', 'c', 'd'];
            answer = optionsMap[answerIndex];  // 선택한 답안의 레이블 가져오기 ('a', 'b', 'c', 'd')

            isCorrect = answerIndex === currentQuestion.correctAnswer;
        } else if (currentQuestion.type === 'shortAnswer') {
            answer = answerIndex.trim();  // 주관식의 경우 사용자가 입력한 답안 그대로 사용
            isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
        } else {
            console.error("Invalid question or choice index:", currentQuestion, answerIndex);
            return;  // 오류가 발생하면 함수를 종료
        }

        setSelectedAnswer(answer);
        setFeedback(isCorrect);
        setShowFeedback(true);
        setShowNextButtons(true); // 답안 제출 후 버튼들 표시

        // 서버에 답안 제출
        submitAnswerToServer(currentQuestion.idx, userId, answer);  // answer를 전송 (이제 'a', 'b', 'c', 'd' 중 하나가 전송됨)

        if (isCorrect) {
            onCorrectAnswer();
        } else {
            onWrongAnswer();
        }
    }, [currentQuestion, onCorrectAnswer, onWrongAnswer]);

    // 서버에 답안을 제출하는 함수
    const submitAnswerToServer = async (questionId, studentId, answer) => {
        console.log("Submitting answer with idx:", questionId);  // 로그 추가

        const payload = {
            idx: questionId,
            studentId: studentId,
            studentAnswer: answer
        };
        console.log("Submitting payload:", JSON.stringify(payload)); // 직렬화된 JSON 확인

        try {
            const response = await fetch("http://localhost:5173/api/answers/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),  // JSON 직렬화
            });

            if (!response.ok) {
                throw new Error("Failed to submit answer");
            }

            const result = await response.json();
            console.log("Answer submission result:", result);

        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50 overflow-visible"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bg-white rounded-xl shadow-2xl w-[800px] m-4 z-10"
                    style={{ bottom: '0%' }}
                >
                    {/* 하단 버튼 영역 - 순서 변경 */}
                    <div className="p-6 border-t bg-gray-50 rounded-t-xl">
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowExplanation(!showExplanation)}
                                className="py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
                            >
                                {showExplanation ? '해설 닫기' : '해설 보기'}
                            </button>
                            <button
                                onClick={handleNextQuestion}
                                className="py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
                            >
                                다음 문제
                            </button>
                        </div>
                    </div>

                    {/* 해설 영역 */}
                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative bg-gray-50 p-6 rounded-lg"
                            >
                                <div className="flex items-center mb-2">
                                    <span className="text-xl mr-2">💡</span>
                                    <h4 className="font-bold text-base text-gray-700">해설</h4>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto pr-2"> {/* 스크롤 가능한 영역 설정 */}
                                    <div className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                        {currentQuestion.explanation}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 상단 결과 표시 */}
                    <div className="p-6 border-t">
                        <h3 className="text-2xl font-bold text-center text-gray-800">
                            {feedback ? '정답입니다! 🎉' : '틀렸습니다. 😢'}
                        </h3>
                    </div>
                </motion.div>
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
                                        onClick={() => handleAnswer(index)}
                                        className="relative h-full rounded-lg shadow-md transition-all duration-300 hover:shadow-lg h-32 flex flex-col"
                                        style={{
                                            backgroundColor: colors[index],
                                        }}
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <div
                                            className="w-full h-full flex flex-col items-center justify-center text-center p-6">
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
                        <div className="w-1/2 h-full p-6 flex flex-col items-center justify-center">
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
                <div className={`flex-1 transition-all duration-300 ${showNextButtons ? 'mr-1/4' : ''}`}>
                    {renderQuestion()}
                </div>
                {renderNextButtons()}
            </motion.div>
        </div>
    );
};

export default GameProgressPage;
