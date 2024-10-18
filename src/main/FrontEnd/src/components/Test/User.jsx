// src/components/MemberList.jsx

import React, { useState, useEffect } from 'react';

// 회원 리스트 컴포넌트
const MemberList = () => {
    // 상태 변수 정의: 회원 데이터와 로딩 상태 관리
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 데이터 불러오기 함수
    const fetchMembers = async () => {
        try {
            // API 호출 예시 (fetch 사용)
            const response = await fetch('http://localhost:8085/api/users'); // 테스트용 API 사용
            const data = await response.json();
            setMembers(data); // 회원 데이터 설정
            setLoading(false); // 로딩 완료
        } catch (error) {
            console.error('회원 데이터를 가져오는 중 오류 발생:', error);
            setLoading(false); // 로딩 완료
        }
    };

    // 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        fetchMembers();
    }, []);

    // 로딩 중일 때 표시할 컴포넌트
    if (loading) return <p>로딩 중...</p>;

    return (
        <div>
            <h1>회원 리스트</h1>
            <ul>
                {members.map((member) => (
                    <li key={member.id}>
                        <strong>{member.name}</strong> - {member.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MemberList;
