import React, { useEffect, useState } from 'react';

function UserRanking() {
    const [users, setUsers] = useState([]); // 사용자 데이터 저장
    const [error, setError] = useState(null); // 에러 메시지 저장

    // 서버로부터 사용자 데이터 가져오기
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8085/api/users/all');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data); // 데이터 설정
            } catch (err) {
                setError('데이터를 불러오는데 실패했습니다.');
                console.error('Fetch error:', err);
            }
        };

        fetchUsers(); // 데이터 가져오기 함수 호출
    }, []); // 페이지가 처음 렌더링될 때 실행

    // 에러 발생 시 메시지 출력
    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>사용자 랭킹</h1>
            <ul>
                {users.map((user, index) => (
                    <li key={user.id}>
                        {index + 1}. {user.nickname} (등급: {user.grade}, 경험치: {user.exp})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserRanking;
