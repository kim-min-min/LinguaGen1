import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const questions = [
    // 4지선다 문법 문제
    {
        type: 'multipleChoice',
        question: "Which sentence is grammatically correct?",
        options: ["I have been to Paris last year.", "I went to Paris last year.", "I have gone to Paris last year.", "I had been going to Paris last year."],
        correctAnswer: 1
    },
    // 4지선다 어휘 문제
    {
        type: 'multipleChoice',
        question: "What's the meaning of 'ubiquitous'?",
        options: ["Rare", "Everywhere", "Unique", "Transparent"],
        correctAnswer: 1
    },
    // 4지선다 독해 문제
    {
        type: 'multipleChoice',
        question: "Based on the passage: The cat sat on the mat. It was purring loudly. What can we infer?",
        options: ["The cat was angry", "The cat was content", "The cat was hungry", "The cat was sleeping"],
        correctAnswer: 1
    },
    // 빈칸 채우기 문제 1
    {
        type: 'fillInTheBlank',
        question: "The sun _____ in the east and sets in the west.",
        answer: "rises"
    },
    // 빈칸 채우기 문제 2
    {
        type: 'fillInTheBlank',
        question: "Water _____ at 100 degrees Celsius at sea level.",
        answer: "boils"
    },
    // 빈칸 채우기 문제 3
    {
        type: 'fillInTheBlank',
        question: "The Earth _____ around the Sun.",
        answer: "revolves"
    },
    // 빈칸 채우기 문제 4
    {
        type: 'fillInTheBlank',
        question: "Photosynthesis is the process by which plants make their own _____.",
        answer: "food"
    },
    // 리스닝 문제 1
    {
        type: 'listening',
        audioSrc: 'path/to/audio1.mp3',
        question: "What did the speaker say about the weather?",
        options: ["It's going to rain", "It's going to be sunny", "It's going to snow", "It's going to be windy"],
        correctAnswer: 0
    },
    // 리스닝 문제 2
    {
        type: 'listening',
        audioSrc: 'path/to/audio2.mp3',
        question: "What time did the speaker say the meeting starts?",
        options: ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"],
        correctAnswer: 2
    },
    // 리스닝 문제 3
    {
        type: 'listening',
        audioSrc: 'path/to/audio3.mp3',
        question: "What is the main topic of the conversation?",
        options: ["Weather", "Politics", "Sports", "Education"],
        correctAnswer: 3
    }
];

const GameProgressPage = ({ onCorrectAnswer, onWrongAnswer, currentQuestion: currentQuestionNumber, totalQuestions, isGameOver, isGameClear, onRestart, onMainMenu }) => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentQuestionNumber - 1);
    const [userAnswer, setUserAnswer] = useState('');
    const [isSliding, setIsSliding] = useState(false);
    const [slideDirection, setSlideDirection] = useState('left');
    const [gameOverAnimation, setGameOverAnimation] = useState(false);

    const colors = ['#FF0000', '#FFA500', '#FFFF00', '#00FF00']; // 빨, 주, 노, 초

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = useCallback((answer) => {
        let isCorrect = false;
        if (currentQuestion.type === 'multipleChoice' || currentQuestion.type === 'listening') {
            isCorrect = answer === currentQuestion.correctAnswer;
        } else if (currentQuestion.type === 'fillInTheBlank') {
            isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase();
        }

        if (isCorrect) {
            onCorrectAnswer();
        } else {
            onWrongAnswer();
        }

        setIsSliding(true);
        setSlideDirection('left');

        setTimeout(() => {
            setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
            setUserAnswer('');
            setSlideDirection('right');
        }, 500);

        setTimeout(() => {
            setIsSliding(false);
        }, 1000);
    }, [currentQuestion, onCorrectAnswer, onWrongAnswer]);

    const handleMainMenuClick = () => {
        navigate('/main');
    };

    useEffect(() => {
        if (isGameOver) {
            setTimeout(() => {
                setGameOverAnimation(true);
            }, 50);
        }
    }, [isGameOver]);

    const renderQuestion = () => {
        switch (currentQuestion.type) {
            case 'multipleChoice':
            case 'listening':
                return (
                    <>
                        <div className='flex flex-col justify-center items-center' style={{ width: '33%', padding: '10px', borderRight: '3px solid #ccc', fontSize: '24px' }}>
                            <h2>{currentQuestion.question}</h2>
                            {currentQuestion.type === 'listening' && (
                                <button onClick={() => new Audio(currentQuestion.audioSrc).play()}>
                                    Play Audio
                                </button>
                            )}
                        </div>
                        <div
                            style={{
                                width: '67%',
                                padding: '10px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                transition: 'all 0.5s ease',
                                transform: `translateX(${isSliding ? (slideDirection === 'left' ? '-100%' : '100%') : '0'})`,
                                opacity: isSliding ? 0 : 1,
                            }}
                        >
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    style={{
                                        fontSize: '18px',
                                        width: 'calc(50% - 5px)',
                                        height: 'calc(50% - 5px)',
                                        backgroundColor: colors[index],
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.05)';
                                        e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                );
            case 'fillInTheBlank':
                return (
                    <div
                        className='flex flex-col justify-center items-center'
                        style={{

                            width: '100%',
                            padding: '10px',
                            transition: 'all 0.5s ease',
                            transform: `translateY(${isSliding ? (slideDirection === 'left' ? '100%' : '-100%') : '0'})`,
                            opacity: isSliding ? 0 : 1,
                        }}
                    >
                        <h2>{currentQuestion.question}</h2>
                        <input
                            type="text"
                            className='my-8 border-2'
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            style={{ fontSize: '18px', padding: '8px', marginRight: '10px' }}
                        />
                        <button className='hover:bg-gray-200 duration-500' onClick={() => handleAnswer(userAnswer)}>Submit</button>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderGameOver = () => {
        return (
            <div 
                className='flex flex-col justify-center items-center w-full h-full'
                style={{
                    transition: 'all 1s ease-out',
                    transform: gameOverAnimation ? 'translateY(0)' : 'translateY(-100%)',
                    opacity: gameOverAnimation ? 1 : 0,
                }}
            >
                <h2 className='text-4xl font-bold mb-8 text-red-600'>Game Over</h2>
                <div className='flex space-x-4'>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={onRestart}
                    >
                        다시하기
                    </button>
                    <button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                        onClick={handleMainMenuClick}
                    >
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        );
    };

    const renderGameClear = () => {
        return (
            <div className='flex flex-col justify-center items-center w-full h-full'>
                <h2 className='text-4xl font-bold mb-8 text-green-600'>Game Clear!</h2>
                <div className='flex space-x-4'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={onRestart}>
                        다시하기
                    </button>
                    <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' onClick={handleMainMenuClick}>
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        );
    };

    if (isGameOver) {
        return renderGameOver();
    }

    if (isGameClear) {
        return renderGameClear();
    }

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
            {renderQuestion()}
        </div>
    );
};

export default GameProgressPage;
