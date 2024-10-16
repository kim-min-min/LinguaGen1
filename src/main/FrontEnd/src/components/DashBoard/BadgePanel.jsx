import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Lock } from 'lucide-react'

// Switch 컨테이너 및 슬라이드 애니메이션 스타일 정의
const SwitchContainer = styled.div`
  position: relative;
  width: 300px;
  height: 40px;
  background-color: #f0f4f8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  margin-bottom: 20px;
`

const SwitchSlider = styled.div`
  position: absolute;
  top: 4px;
  left: ${({ activeTab }) => (activeTab === 'challenges' ? '4px' : '150px')}; /* 탭 전환 시 위치 */
  width: 146px;
  height: 32px;
  background-color: #000000;
  border-radius: 16px;
  transition: left 0.3s ease; /* 부드러운 슬라이드 전환 */
`

const SwitchButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 146px;
  height: 32px;
  background-color: transparent;
  color: ${({ active }) => (active ? '#ffffff' : '#000000')};
  border: none;
  z-index: 1;
  font-weight: bold;
  cursor: pointer;
  border-radius: 16px;
  transition: color 0.3s ease;
`

// Badge 아이템 스타일 정의
const BadgeItem = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ unlocked }) => (unlocked ? '#ffffff' : '#f0f4f8')};
  opacity: ${({ unlocked }) => (unlocked ? '1' : '0.5')};
  transition: opacity 0.3s ease;
  box-shadow: ${({ unlocked }) => (unlocked ? '0px 4px 15px rgba(0, 0, 0, 0.25)' : '0px 2px 8px rgba(0, 0, 0, 0.15)')};
  
  &:hover > div {
    opacity: 1;
    visibility: visible;
  }

  svg {
    position: absolute;
    bottom: 8px;
    right: 8px;
    opacity: ${({ unlocked }) => (unlocked ? '0' : '1')};
  }
`

// Tooltip 스타일 정의
const Tooltip = styled.div`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #000;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
`

const BadgeText = styled.p`
  margin-top: 8px;
  text-align: center;
  font-weight: bold;
  color: ${({ unlocked }) => (unlocked ? '#000000' : '#afb9c9')};
  white-space: nowrap; /* 텍스트를 한 줄로 유지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 텍스트가 길면 말줄임표로 처리 */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
`

// Badge 컨테이너를 grid로 정렬하여 일정한 간격 유지, 한 열에 5개 제한
const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 한 줄에 5개의 칸 */
  grid-gap: 40px; /* 간격을 일정하게 */
  justify-items: center; /* 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%;
`

const BadgePanel = () => {
  const [activeTab, setActiveTab] = useState('challenges'); // 기본 탭을 'challenges'로 설정
  const [badges, setBadges] = useState([]); // JSON 데이터를 저장할 상태값

  // JSON 파일을 fetch로 불러오는 함수
  useEffect(() => {
    const fetchBadges = async () => {
      const challengesResponse = await fetch('src/Challenges.json');
      const activitiesResponse = await fetch('src/Activities.json');
      const challengesBadges = await challengesResponse.json();
      const activitiesBadges = await activitiesResponse.json();

      if (activeTab === 'challenges') {
        setBadges(challengesBadges);
      } else {
        setBadges(activitiesBadges);
      }
    };

    fetchBadges();
  }, [activeTab]); // activeTab이 바뀔 때마다 데이터를 다시 불러옴

  return (
    <div className='flex flex-col items-center justify-start w-full pt-20 pl-24'>
      <div className='w-full'>
        <h4 className='font-bold'>뱃지</h4>
      </div>

      {/* Switch 탭 구현 */}
      <SwitchContainer>
        <SwitchSlider activeTab={activeTab} /> {/* 슬라이더 애니메이션 */}
        <SwitchButton active={activeTab === 'challenges'} onClick={() => setActiveTab('challenges')}>
          Challenges
        </SwitchButton>
        <SwitchButton active={activeTab === 'activities'} onClick={() => setActiveTab('activities')}>
          Activities
        </SwitchButton>
      </SwitchContainer>

      <div className='flex flex-col items-start justify-start w-full mt-10'>
        <BadgeGrid style={{ marginBottom: '45px' }}>
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <BadgeItem unlocked={badge.unlocked}>
                <img
                  src={badge.src || 'https://via.placeholder.com/60'} // 실제 이미지로 대체 가능
                  alt={badge.title}
                  style={{ borderRadius: '50%' }}
                />
                <Lock size={20} /> {/* 잠금 아이콘 */}
                <Tooltip>{badge.description}</Tooltip> {/* 툴팁 */}
              </BadgeItem>
              <BadgeText unlocked={badge.unlocked}>{badge.title}</BadgeText>
            </div>
          ))}
        </BadgeGrid>
      </div>
    </div>
  );
}

export default BadgePanel;
