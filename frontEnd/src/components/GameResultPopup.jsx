import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #000;
  }
`;

const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  margin: 0.8rem 0;
  gap: 1rem;
`;

const DistributionLabel = styled.div`
  width: 20px;
  text-align: right;
  font-weight: bold;
`;

const DistributionValue = styled.span`
  margin-left: 8px;
  color: white;
  font-weight: bold;
  position: absolute;
  right: 8px;
`;

const GameResultPopup = ({ 
  isWin, 
  attempts, 
  distribution, 
  totalGames, 
  winRate, 
  currentStreak, 
  maxStreak,
  onClose 
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const maxDistribution = Math.max(...Object.values(distribution), 1); // 최소값 1 설정

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);
  
  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>

        <h2 className="text-2xl font-bold mb-4 jua-regular">
          {isWin ? "축하합니다!" : "아쉽네요!"}
        </h2>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalGames}</div>
            <div className="text-sm text-gray-600">전체 도전</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{winRate}%</div>
            <div className="text-sm text-gray-600">승률</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-sm text-gray-600">현재 연승</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{maxStreak}</div>
            <div className="text-sm text-gray-600">최대 연승</div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 jua-regular">도전 분포</h3>
          {[1, 2, 3, 4, 5, 6].map(attempt => (
            <DistributionRow key={attempt}>
              <DistributionLabel>{attempt}</DistributionLabel>
              <div className="flex-1 relative">
                <Progress 
                  value={(distribution[attempt] / maxDistribution) * 100}
                  className="h-[20px] rounded-full"
                  indicatorClassName={`${isWin && attempts === attempt ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}
                />
                <DistributionValue>
                  {distribution[attempt]}
                </DistributionValue>
              </div>
            </DistributionRow>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            다음 문제는 내일 00시에 공개됩니다
          </p>
          <p className="text-lg font-bold">
            남은 시간: {timeLeft}
          </p>
        </div>
      </PopupContent>
    </PopupOverlay>
  );
};

export default GameResultPopup;