import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // HTTP 요청 라이브러리

function User() {
    const [id, setId] = useState(''); // 아이디 입력 상태
    const [password, setPassword] = useState(''); // 비밀번호 입력 상태
    const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태
    const [phone, setPhone] = useState(''); // 전화번호 입력 상태
    const [isSignup, setIsSignup] = useState(false); // 회원가입/로그인 전환 상태
    const [error, setError] = useState(''); // 에러 메시지 상태
    const navigate = useNavigate(); // 페이지 이동 함수

    // 로그인 버튼 클릭 시 실행되는 함수
    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지

        try {
            const response = await axios.post(
                'http://localhost:8085/api/users/login',
                { id, password },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data === '로그인 성공') {
                alert('로그인 성공!');
                navigate('/main'); // 메인 페이지로 이동
            } else {
                setError('아이디 또는 비밀번호가 잘못되었습니다.');
            }
        } catch (err) {
            console.error('에러 발생:', err);
            setError('로그인 중 오류가 발생했습니다.');
        }
    };

    // 회원가입 버튼 클릭 시 실행되는 함수
    const handleSignup = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8085/api/users', {
                id,
                password,
                phone,
            });

            if (response.status === 201) {
                alert('회원가입이 완료되었습니다!');
                setIsSignup(false); // 회원가입 후 로그인 화면으로 이동
            } else {
                setError('회원가입에 실패했습니다.');
            }
        } catch (err) {
            console.error('회원가입 중 오류 발생:', err);
            setError('회원가입 중 오류가 발생했습니다.');
        }
    };

    // 로그인/회원가입 전환
    const toggleSignup = () => {
        setIsSignup(!isSignup);
        setError(''); // 에러 메시지 초기화
    };

    return (
        <div className="login-container" style={styles.container}>
            <h2>{isSignup ? '회원가입' : '로그인'}</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={isSignup ? handleSignup : handleLogin} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="id">아이디</label>
                    <input
                        type="text"
                        id="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {isSignup && (
                    <>
                        <div style={styles.inputGroup}>
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="phone">전화번호</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit" style={styles.button}>
                    {isSignup ? '회원가입' : '로그인'}
                </button>
                <button
                    type="button"
                    onClick={toggleSignup}
                    style={styles.toggleButton}
                >
                    {isSignup ? '로그인 화면으로 돌아가기' : '회원가입'}
                </button>
            </form>
        </div>
    );
}

// 간단한 CSS 스타일 객체
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
    },
    form: {
        width: '300px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    toggleButton: {
        marginTop: '10px',
        width: '100%',
        padding: '10px',
        backgroundColor: '#f1f1f1',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default User;
