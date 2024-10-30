import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import styled from 'styled-components';

const Item = styled.div`
  display: list-item;
  list-style-position: inside;
  padding: 14px;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? '#bbf7d0' : 'black')}; /* 클릭된 상태일 때 색상 변경 */
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ isActive }) => (isActive ? '#bbf7d0' : '#bbf7d0')}; /* hover 상태에서 색상 변경 */
  }
  transition: color 0.3s ease; /* 부드러운 색상 전환 애니메이션 */
`;

const DashBoardPageSide = ({ activePanel, setActivePanel }) => {
  const navigate = useNavigate(); // useNavigate 사용

  return (
    <div className='flex flex-col items-center justify-start w-80 border-2 border-gray-300 rounded-lg' style={{backdropFilter : 'blur(15px)' , background : 'rgba(255, 255, 255, 0.2', height : 'auto'}}>
      <div className='flex flex-col items-start justify-between w-full h-48 pt-4 p-4'>
        {/* Avatar 클릭 시 MyPageSettingPanel로 이동 */}
        <Avatar className='w-20 h-20 ml-4'>
          <AvatarImage
            src={"https://github.com/shadcn.png"}
            alt="프로필 이미지"
            onClick={() => navigate('/mypage?tab=accountSettings')} // 쿼리 파라미터로 탭 설정
            style={{ cursor: 'pointer' }} // 클릭 가능한 커서 스타일 추가
          />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
        <p className='text-center w-1/2 mt-4'>Name</p>
      </div>
      <Separator className='w-full mt-8 mb-8 border-2' />
      <div className='flex flex-row justify-between w-full'>
        <div className='flex flex-col w-full h-12 items-center justify-start'>
          <p className='font-bold'> 게임 진행 수</p>
          <p> - </p>
        </div>
        <div className='flex flex-col w-full h-12 items-center justify-start'>
          <p className='font-bold'> 평균 오답률</p>
          <p> - </p>
        </div>
      </div>
      <Separator className='w-full mt-8 mb-8 border-2' />
      <div className='flex flex-col w-full h-full items-start justify-start'>
        <Item
          isActive={activePanel === 'dashboard'}
          onClick={() => setActivePanel('dashboard')}
        >
          대시보드
        </Item>
        <Item
          isActive={activePanel === 'badge'}
          onClick={() => setActivePanel('badge')}
          style={{marginBottom : '45px'}}
        >
          뱃지 / 업적
        </Item>
      </div>
    </div>
  );
};

export default DashBoardPageSide;
