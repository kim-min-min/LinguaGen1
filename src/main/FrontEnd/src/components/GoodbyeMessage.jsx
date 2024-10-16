import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // App.css 파일을 import 합니다.

function GoodbyeMessage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트가 마운트된 직후 fade-in을 시작합니다.
    setTimeout(() => setFadeIn(true), 100);

    // 3초 후에 fade-out을 시작합니다.
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    // fade-out 애니메이션이 끝나고 나서 MainPage로 이동
    const navigateTimer = setTimeout(() => {
      navigate('/main');
    }, 6000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div style={{userSelect : 'none'}} className={`goodbye-message ${fadeIn ? 'fade-in' : ''} ${fadeOut ? 'fade-out' : ''}`}>
      수고하셨습니다
    </div>
  );
}

export default GoodbyeMessage;