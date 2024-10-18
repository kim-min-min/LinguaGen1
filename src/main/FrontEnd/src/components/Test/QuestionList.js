import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);  // 상태에 문제 리스트 저장
    const [loading, setLoading] = useState(true);    // 로딩 상태

    // 컴포넌트가 마운트될 때 API 호출
    useEffect(() => {
        axios.get('http://localhost:8085/question')  // Spring Boot API 호출
            .then((response) => {
                setQuestions(response.data);  // 응답 데이터를 상태에 저장
                setLoading(false);  // 로딩 완료
            })
            .catch((error) => {
                console.error('Error fetching questions:', error);
                setLoading(false);  // 에러 발생 시 로딩 완료로 설정
            });
    }, []);

    // 로딩 중이면 로딩 메시지 표시
    if (loading) {
        return <p>Loading questions...</p>;
    }

    // 데이터를 화면에 렌더링
    return (
        <div>
            <h1>Question List</h1>
            <ul>
                {questions.map((question) => (
                    <li key={question.id}>
                        <h2>{question.type}</h2>
                        <p>{question.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionList;
