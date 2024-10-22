import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Header from "./Header";

// 스타일 정의
const GameBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  justify-items: center;
  align-items: center;
`;

const GuessRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const WordInput = styled.input`
  width: 60px;
  height: 60px;
  font-size: 36px;
  text-transform: uppercase;
  text-align: center;
  background-color: #ffffff;
  border: 2px solid #d3d6da;
  color: #000000;
  border-radius: 5px;
  outline: none;
  padding: 0;
  box-sizing: border-box;
  transition: border 0.2s ease;  // 애니메이션 추가

  &:disabled {
    background-color: #ffffff;
    border: 2px solid #d3d6da;
  }

  // 입력이 있을 때 검은색 두꺼운 테두리로 애니메이션 적용
  &.input-active {
    border: 4px solid #000000;
  }

  &.correct {
    background-color: #6aaa64;
    color: white;
  }

  &.present {
    background-color: #c9b458;
    color: white;
  }

  &.absent {
    background-color: #787c7e;
    color: white;
  }
`;


const GameKeyboard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`;

const KeyboardLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const KeyboardItem = styled.button`
  width: 45px;
  height: 60px;
  font-size: 18px;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #d3d6da;
  border-radius: 5px;
  text-transform: uppercase;
  cursor: pointer;
  display : flex;
  justify-content : center;
  align-items : center;

  &.correct {
    background-color: #6aaa64;
    color: white;
    border-color: #6aaa64;
  }

  &.present {
    background-color: #c9b458;
    color: white;
    border-color: #c9b458;
  }

  &.absent {
    background-color: #787c7e;
    color: white;
    border-color: #787c7e;
  }
`;

const WordSubmit = styled(KeyboardItem)`
  width: 100px;
  background-color: #538d4e;
  color: white;
`;

const WordDelete = styled(KeyboardItem)`
  width: 100px;
  background-color: #d73a3a;
  color: white;
`;

const GameHint = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HintButton = styled.button`
  background-color: #818384;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #6e6e6f;
  }
`;

const HintText = styled.p`
  margin-top: 15px;
  padding: 15px;
  background-color: #3a3a3c;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  max-width: 300px;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  transition: opacity 0.3s ease;
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비디오가 화면에 맞도록 커버되도록 설정 */
  z-index: -1; /* 다른 요소 뒤에 배치 */
`;

const DailyQuiz = () => {
    const [currentAttempt, setCurrentAttempt] = useState(1);
    const [currentInputIndex, setCurrentInputIndex] = useState(0);
    const [keyboardStatus, setKeyboardStatus] = useState({});
    const [inputs, setInputs] = useState(
        Array.from({ length: 6 }, () => Array(5).fill(""))
    );
    const [isGameOver, setIsGameOver] = useState(false);
    const [hintVisible, setHintVisible] = useState(false);
    const [hintText, setHintText] = useState("");

    const handleInputChange = (char, row, col) => {
        if (isGameOver || col >= 5) return;

        const englishChar = char.replace(/[^A-Za-z]/g, "").toUpperCase();
        if (!englishChar) return;

        const updatedInputs = [...inputs];
        updatedInputs[row][col] = englishChar;
        setInputs(updatedInputs);

        const inputElement = document.getElementById(`input-${row}-${col}`);
        if (inputElement) {
            inputElement.classList.add('input-active');
        }

        if (col < 4) {
            const nextInput = document.getElementById(`input-${row}-${col + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const checkGuess = (guess) => {
        let result = Array(5).fill("absent"); // 기본적으로 모든 글자는 "absent"
        const targetArray = targetWord.split(""); // 목표 단어 배열

        // 1. 먼저 정답인 위치를 확인하여 "correct" 처리
        guess.forEach((char, index) => {
            if (char === targetArray[index]) {
                result[index] = "correct";
                targetArray[index] = null; // 사용한 글자는 제거
            }
        });

        // 2. 남은 글자들 중 존재하는 글자를 "present" 처리
        guess.forEach((char, index) => {
            if (result[index] !== "correct" && targetArray.includes(char)) {
                result[index] = "present";
                targetArray[targetArray.indexOf(char)] = null; // 사용한 글자는 제거
            }
        });

        return result;
    };

    /*// 수정된 deleteLastChar 함수
    const deleteLastChar = () => {
        const currentRow = currentAttempt - 1;

        if (currentInputIndex > 0 && currentInputIndex <= 5) {
            const updatedInputs = [...inputs];
            updatedInputs[currentRow][currentInputIndex - 1] = ""; // 글자를 지움
            setInputs(updatedInputs);
            setCurrentInputIndex(currentInputIndex - 1); // 이전 칸으로 포커스 이동

            // 지운 후 포커스를 이동하고, 글자를 지운 칸의 input-active 클래스를 제거
            const prevInput = document.getElementById(`input-${currentRow}-${currentInputIndex - 1}`);
            if (prevInput) {
                prevInput.classList.remove('input-active');
                prevInput.focus();
            }
        } else if (currentInputIndex === 5 && inputs[currentRow][4] !== "") {
            // 5번째 칸에 글자가 있을 경우 처리
            const updatedInputs = [...inputs];
            updatedInputs[currentRow][4] = ""; // 5번째 칸 지우기
            setInputs(updatedInputs);
            setCurrentInputIndex(4); // 포커스를 5번째 칸으로 이동

            // 지운 후 5번째 칸의 input-active 클래스를 제거
            const lastInput = document.getElementById(`input-${currentRow}-4`);
            if (lastInput) {
                lastInput.classList.remove('input-active');
                lastInput.focus();
            }
        } else if (currentInputIndex === 0 && inputs[currentRow].every(input => input !== "")) {
            // 모두 입력된 상태에서 5번째 글자부터 지울 때 처리
            const updatedInputs = [...inputs];
            updatedInputs[currentRow][4] = ""; // 5번째 칸 지우기
            setInputs(updatedInputs);
            setCurrentInputIndex(4); // 포커스를 5번째 칸으로 이동

            // 지운 후 5번째 칸의 input-active 클래스를 제거
            const lastInput = document.getElementById(`input-${currentRow}-4`);
            if (lastInput) {
                lastInput.classList.remove('input-active');
                lastInput.focus();
            }
        }
    };*/

    const deleteLastChar = () => {
        const currentRow = currentAttempt - 1;
        let newInputIndex = currentInputIndex;

        if (currentInputIndex > 0) {
            newInputIndex = currentInputIndex - 1;
        } else if (currentInputIndex === 0 && inputs[currentRow].some(input => input !== "")) {
            // 현재 행의 마지막 입력된 글자를 찾습니다.
            newInputIndex = inputs[currentRow].findLastIndex(input => input !== "");
        }

        if (newInputIndex >= 0) {
            const updatedInputs = [...inputs];
            updatedInputs[currentRow][newInputIndex] = "";
            setInputs(updatedInputs);
            setCurrentInputIndex(newInputIndex);

            // 포커스 이동 및 스타일 업데이트
            const inputElement = document.getElementById(`input-${currentRow}-${newInputIndex}`);
            if (inputElement) {
                inputElement.classList.remove('input-active');
                inputElement.focus();
            }
        }
    };

    const submitGuess = async () => {
        if (inputs[currentAttempt - 1].some(input => input === "")) {
            alert("모든 칸에 글자를 입력해주세요.");
            return;
        }

        const guess = inputs[currentAttempt - 1].join('');

        try {
            const response = await axios.post("http://localhost:8085/api/check-guess", {
                guess: guess,
                attemptNumber: currentAttempt
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = response.data.result; // 백엔드에서 반환한 결과

            // 결과에 따라 UI 업데이트
            result.forEach((status, index) => {
                const inputElement = document.getElementById(`input-${currentAttempt - 1}-${index}`);
                if (inputElement) {
                    inputElement.classList.add(status);
                }
            });

            updateKeyboardStatus(guess, result);

            if (result.every(status => status === "correct")) {
                alert("축하합니다! 정답을 맞추셨습니다!");
                setIsGameOver(true);
            } else if (currentAttempt >= 6) {
                alert("게임 오버! 모든 시도를 사용하셨습니다.");
                setIsGameOver(true);
            } else {
                setCurrentAttempt(currentAttempt + 1);
                setCurrentInputIndex(0);
                // 다음 줄의 첫 번째 입력 칸으로 포커스 이동
                setTimeout(() => {
                    const nextInput = document.getElementById(`input-${currentAttempt}-0`);
                    if (nextInput) {
                        nextInput.focus();
                    }
                }, 0);
            }
        } catch (error) {
            console.error('제출 오류:', error);
            alert('답안을 제출하는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isGameOver) return;

            if (event.key === "Enter") {
                event.preventDefault();
                submitGuess();
            } else if (event.key === "Backspace") {
                event.preventDefault();
                deleteLastChar();
            } else if (/^[A-Za-z]$/.test(event.key)) {
                event.preventDefault();
                handleKeyInput(event.key.toUpperCase());
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isGameOver, currentAttempt, currentInputIndex, inputs]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 첫 번째 입력 칸에 포커스 설정
        const firstInput = document.getElementById('input-0-0');
        if (firstInput) {
            firstInput.focus();
        }
    }, []);

    useEffect(() => {
        // currentAttempt가 변경될 때마다 실행
        if (!isGameOver) {
            const nextInput = document.getElementById(`input-${currentAttempt - 1}-0`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    }, [currentAttempt, isGameOver]);

    const handleKeyInput = (key) => {
        if (isGameOver) return;

        if (key === "ENTER") {
            submitGuess();
        } else if (key === "DELETE") {
            deleteLastChar();
        } else if (/^[A-Z]$/i.test(key)) {
            // 입력 후 포커스 자동 이동
            const currentRow = currentAttempt - 1;
            handleInputChange(key, currentRow, currentInputIndex);
            /*            if (currentInputIndex < 4) {
                            setCurrentInputIndex(currentInputIndex + 1);
                        }*/
            if (currentInputIndex < 5) {
                handleInputChange(key, currentRow, currentInputIndex);
                setCurrentInputIndex(currentInputIndex + 1);
            }
        }
    };

    const updateKeyboardStatus = (guess, result) => {
        const newStatus = { ...keyboardStatus };
        guess.split('').forEach((letter, index) => {
            const status = result[index];
            if (status === 'correct' || (status === 'present' && newStatus[letter] !== 'correct') ||
                (status === 'absent' && !['correct', 'present'].includes(newStatus[letter]))) {
                newStatus[letter] = status;
            }
        });
        setKeyboardStatus(newStatus);
    };

    const fetchHint = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8085/api/get-hint',  // 여기는 예를 들어 스프링 포트번호가 8083이면 83, 82면 82 를 넣으면 됩니다.
                {}, // POST 요청 시 보낼 데이터가 없을 경우 빈 객체를 보냅니다.
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,  // 쿠키와 인증 관련 정보를 포함하여 요청
                }
            );
            setHintText(response.data.hint);  // 서버에서 받은 힌트를 상태로 설정
            setHintVisible(true);  // 힌트 보이기 설정
        } catch (error) {
            console.error('힌트 요청 오류:', error);
            alert('힌트를 가져오는 데 실패했습니다.');
        }
    };


    return (
        <div className="h-full w-full relative">
            <BackgroundVideo autoPlay muted loop>
                <source src='src/assets/video/MainBackground.mp4' type='video/mp4' />
            </BackgroundVideo>
            <Header />
            <div className="flex flex-col justify-start items-center w-full h-full mb-12">
                <h1 className="mb-12 font-bold">Daily Quiz</h1>
                <GameBoard>
                    {inputs.map((row, rowIndex) => (
                        <GuessRow key={rowIndex}>
                            {row.map((input, colIndex) => (
                                <WordInput
                                    key={colIndex}
                                    id={`input-${rowIndex}-${colIndex}`}
                                    value={input}
                                    disabled={rowIndex !== currentAttempt - 1}
                                    onChange={(e) =>
                                        handleInputChange(e.target.value, rowIndex, colIndex)
                                    }
                                    maxLength={1}
                                />
                            ))}
                        </GuessRow>
                    ))}
                </GameBoard>
                <GameHint>
                    <HintButton onClick={hintVisible ? () => setHintVisible(false) : fetchHint}>
                        {hintVisible ? "힌트 숨기기" : "힌트 사용하기"}
                    </HintButton>
                    <HintText isVisible={hintVisible}>{hintText}</HintText>
                </GameHint>
                <GameKeyboard>
                    <KeyboardLine>
                        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
                            (char, index) => (
                                <KeyboardItem
                                    key={`${char}-${index}`}
                                    onClick={() => handleKeyInput(char)}
                                    className={keyboardStatus[char] || ''}
                                >
                                    {char}
                                </KeyboardItem>
                            )
                        )}
                    </KeyboardLine>
                    <KeyboardLine>
                        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((char, index) => (
                            <KeyboardItem
                                key={`${char}-${index}`}
                                onClick={() => handleKeyInput(char)}
                                className={keyboardStatus[char] || ''}
                            >
                                {char}
                            </KeyboardItem>
                        ))}
                    </KeyboardLine>
                    <KeyboardLine>
                        <WordSubmit onClick={submitGuess}>ENTER</WordSubmit>
                        {["Z", "X", "C", "V", "B", "N", "M"].map((char, index) => (
                            <KeyboardItem
                                key={`${char}-${index}`}
                                onClick={() => handleKeyInput(char)}
                                className={keyboardStatus[char] || ''}
                            >
                                {char}
                            </KeyboardItem>
                        ))}
                        <WordDelete onClick={deleteLastChar}>DELETE</WordDelete>
                    </KeyboardLine>
                </GameKeyboard>
            </div>
        </div>
    );
};

export default DailyQuiz;
