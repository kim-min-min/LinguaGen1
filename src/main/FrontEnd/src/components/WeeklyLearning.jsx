import React, { useState } from 'react';
import { FaBellSlash, FaChevronLeft, FaChevronRight, FaCog } from 'react-icons/fa';
import styled from 'styled-components';
import { Card } from '@/components/ui/card';
import play from '../assets/imgs/play.svg';
import timer from '../assets/imgs/timer.svg';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;

const WeekSelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 20px;
`;

const WeekArrowButton = styled.button`
  background-color: #f1f3f5;
  border: none;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

const DaysContainer = styled.ul`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0;
  list-style: none;
`;

const DayItem = styled.li`
  text-align: center;
  flex: 1;
  position: relative;
`;

const DayCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => (props.selected ? '#00b894' : '#dee2e6')};
  margin: 0 auto 10px;
`;

const DayLabel = styled.p`
  font-size: 14px;
  color: ${props => (props.selected ? '#00b894' : '#6c757d')};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-right: 20px;
  position: relative;

  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: #000;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -120%);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
`;

const FooterIcon = styled.div`
  margin-right: 5px;
`;

const WeeklyLearning = () => {
  const [selectedDay, setSelectedDay] = useState('화');
  const [weekNumber, setWeekNumber] = useState(1);
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2024);
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: ''
  });

  // 마우스가 아이템 위에 있을 때 툴팁을 보여주는 함수
  const handleMouseMove = (e, content) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.pageY,
      content: content
    });
  };

  // 마우스가 아이템을 벗어났을 때 툴팁을 숨기는 함수
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handlePreviousWeek = () => {
    setWeekNumber(prevWeek => {
      if (prevWeek === 1) {
        setMonth(prevMonth => {
          if (prevMonth === 1) {
            setYear(prevYear => prevYear - 1); // 연도 감소
            return 12; // 12월로 설정
          }
          return prevMonth - 1; // 월을 1 감소
        });
        return 4; // 주차를 4주차로 설정
      }
      return prevWeek - 1; // 주차를 1 감소
    });
  };

  const handleNextWeek = () => {
    setWeekNumber(prevWeek => {
      if (prevWeek === 4) {
        setMonth(prevMonth => {
          if (prevMonth === 12) {
            setYear(prevYear => prevYear + 1); // 연도 증가
            return 1; // 1월로 설정
          }
          return prevMonth + 1; // 월을 1 증가
        });
        return 1; // 주차를 1주차로 설정
      }
      return prevWeek + 1; // 주차를 1 증가
    });
  };

  return (
    <Card className='w-full h-full ml-4 px-10 pb-10 pt-4'>
      <Header style={{ marginBottom: '50px', userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>주간 학습</span>
          <FaCog style={{ marginLeft: '10px', color: '#adb5bd', cursor: 'pointer' }} />
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            outline: 'none'
          }}
        >
          <FaBellSlash />
          <span style={{ marginLeft: '5px' }}>알림 설정</span>
        </button>
      </Header>

      <WeekSelector>
        <WeekArrowButton onClick={handlePreviousWeek}><FaChevronLeft /></WeekArrowButton>
        <span style={{ margin: '0 15px' }}>{year}년 {month}월 {weekNumber}주차</span>
        <WeekArrowButton onClick={handleNextWeek}><FaChevronRight /></WeekArrowButton>
      </WeekSelector>

      <DaysContainer style={{ marginBottom: '50px' }}>
        {days.map(day => (
          <DayItem key={day} onClick={() => setSelectedDay(day)}>
            <DayCircle selected={selectedDay === day} />
            <DayLabel selected={selectedDay === day}>{day}</DayLabel>
          </DayItem>
        ))}
      </DaysContainer>

      <Footer style={{ userSelect: 'none' }}>
        <FooterItem
          onMouseMove={(e) => handleMouseMove(e, '플레이 횟수: 0')}
          onMouseLeave={handleMouseLeave}
        >
          <FooterIcon><img src={play} alt='play' /></FooterIcon>
          <span>0</span>
        </FooterItem>
        <FooterItem
          onMouseMove={(e) => handleMouseMove(e, '플레이 타임: 0분')}
          onMouseLeave={handleMouseLeave}
        >
          <FooterIcon><img src={timer} alt='timer' /></FooterIcon>
          <span>0분</span>
        </FooterItem>
      </Footer>

      {/* 툴팁 */}
      {tooltip.visible && (
        <Tooltip x={tooltip.x} y={tooltip.y - window.scrollY} visible={tooltip.visible}>
          {tooltip.content}
        </Tooltip>
      )}
    </Card>
  );
};

export default WeeklyLearning;
