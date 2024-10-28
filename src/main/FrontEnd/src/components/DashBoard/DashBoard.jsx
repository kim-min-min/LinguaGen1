import React, { useState } from 'react'
import Header from '../Header'
import DashBoardPageSide from './DashBoardPageSide'
import DashBoardPanel from './DashBoardPanel'
import AchievementPanel from './AchievementPanel'
import BadgePanel from './BadgePanel'
import styled from 'styled-components'

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비디오가 화면에 맞도록 커버되도록 설정 */
  z-index: -1; /* 다른 요소 뒤에 배치 */
`;

// MainPage와 동일한 컨테이너 스타일 적용
const DashBoardContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const DashBoard = () => {
  const [activePanel, setActivePanel] = useState('dashboard') // 기본값을 'dashboard'로 설정

  return (
    <DashBoardContainer className='custom-scrollbar'>
      <BackgroundVideo autoPlay muted loop>
        <source src='src/assets/video/DashBoardBackground.mp4' type='video/mp4' />
      </BackgroundVideo>
      <Header />
      
      {/* 메인 컨텐츠 영역을 grid로 구성 */}
      <main className='w-full h-[calc(100vh-300px)] grid grid-cols-12 gap-4 p-4 pt-0'>
        {/* 왼쪽 사이드바 */}
        <div className='col-span-3 col-start-2 flex flex-col gap-8 items-center'>
          <div className='flex items-center justify-center'>
            <DashBoardPageSide 
              activePanel={activePanel} 
              setActivePanel={setActivePanel}
            />
          </div>
        </div>

        {/* 오른쪽 메인 컨테이너 */}
        <div className='col-span-7 flex items-center justify-center'>
          {activePanel === 'dashboard' && <DashBoardPanel />}
          {activePanel === 'achievement' && <AchievementPanel />}
          {activePanel === 'badge' && <BadgePanel />}
        </div>
      </main>
    </DashBoardContainer>
  );
}

export default DashBoard;
