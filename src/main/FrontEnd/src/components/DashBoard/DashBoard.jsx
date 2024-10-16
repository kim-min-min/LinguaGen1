import React, { useState } from 'react'
import Header from '../Header'
import DashBoardPageSide from './DashBoardPageSide'
import DashBoardPanel from './DashBoardPanel'
import AchievementPanel from './AchievementPanel'
import BadgePanel from './BadgePanel'

const DashBoard = () => {
  const [activePanel, setActivePanel] = useState('dashboard') // 기본값을 'dashboard'로 설정

  return (
    <div className='flex flex-col items-center justify-start overflow-y-auto custom-scrollbar' style={{ width: '100%', height: '100%' }}>
      <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
      <div className='flex flex-row items-start justify-center w-3/4'>
        <DashBoardPageSide activePanel={activePanel} setActivePanel={setActivePanel} /> {/* 상태 전달 */}
        {activePanel === 'dashboard' && <DashBoardPanel />} {/* 대시보드 패널 */}
        {activePanel === 'achievement' && <AchievementPanel />} {/* 업적 패널 */}
        {activePanel === 'badge' && <BadgePanel />} {/* 뱃지 패널 */}
      </div>
    </div>
  )
}

export default DashBoard
