import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import PracticeMenubar from './MainPageComponents/PracticeMenubar'; // PracticeMenubar 컴포넌트 불러오기
import ProfileCard from './MainPageComponents/ProfileCard';
import MainContainer from './MainPageComponents/MainContainer';
import WordCarousel from './WordCarousel';
import '../App.css'; // App.css 파일을 import 합니다.
import Header from './Header';
import useStore from '../store/useStore.js';
import { useNavigate } from 'react-router-dom';



const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const MainPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position : relative;
  align-items: center;
  animation: ${fadeInAnimation} 1s forwards;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비디오가 화면에 맞도록 커버되도록 설정 */
  z-index: -1; /* 다른 요소 뒤에 배치 */
`;

function MainPage() {
  const [marginTop, setMarginTop] = useState('1000px'); // 기본적으로 반응형일 때 marginTop 1000px 설정
  const [fadeIn, setFadeIn] = useState(false);
  const { setIsLoggedIn } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      // 화면 크기에 따라 marginTop 설정
      if (window.innerWidth >= 1024) {
        setMarginTop('0px');
      } else {
        setMarginTop('1087px');
      }
    };

    // 로그인 상태 확인
    const user = sessionStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true); // 로그인 상태 유지
    } else {
      setIsLoggedIn(false); // 로그아웃 상태로 설정
    }

    // 초기 화면 크기 체크 및 리스너 등록
    handleResize();
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsLoggedIn]);

  return (
    <MainPageContainer>
      <BackgroundVideo autoPlay muted loop>
        <source src='src/assets/video/MainBackground.mp4' type='video/mp4'/>
      </BackgroundVideo>
      <Header />
      <main className='w-full h-full flex flex-col lg:flex-row items-center justify-center lg:gap-12 lg:overflow-hidden overflow-scroll'>
        {/* 좌측 메뉴바 */}
        <div className='flex justify-start lg:justify-center h-full order-3 lg:order-1 lg:mt-0 mt-14 lg:mb-0 mb-14'>
          <PracticeMenubar />
        </div>

        {/* 메인 컨테이너 */}
        <div className='w-full lg:w-5/12 h-full order-4 lg:order-2'>
          <div className='border-x-2 h-full shadow-xl flex items-center justify-start flex-col'>
            <MainContainer />
          </div>
        </div>

        {/* 프로필 카드와 캐러셀 */}
        <div 
          className='flex justify-center lg:justify-start h-auto lg:h-full flex-col gap-12 w-full lg:w-96 order-1 lg:order-3 items-center lg:items-start'
          style={{ marginTop: marginTop }} // marginTop을 동적으로 적용
        >
          <ProfileCard />
          <WordCarousel />
        </div>
      </main>
    </MainPageContainer>
  );
}

export default MainPage;
