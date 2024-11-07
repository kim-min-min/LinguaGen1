import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from "lucide-react";

function PointRecoveryPopup({ onClose }) {
  const [recoveryAmount, setRecoveryAmount] = useState(10); // 기본값 10%
  const currentPoints = 1000; // 임시 포인트 값
  const pointsNeeded = (recoveryAmount / 10) * 100; // 10% 당 100포인트

  const handleIncrease = () => {
    if (recoveryAmount < 100) {
      setRecoveryAmount(prev => prev + 10);
    }
  };

  const handleDecrease = () => {
    if (recoveryAmount > 10) {
      setRecoveryAmount(prev => prev - 10);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[400px] p-6 bg-white relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center jua-regular">
          피로도 회복
        </h2>

        <div className="flex flex-col items-center gap-6">
          {/* 현재 포인트 표시 */}
          <div className="text-center">
            <p className="text-lg mb-2 jua-regular">현재 보유 포인트</p>
            <p className="text-2xl font-bold text-green-600">{currentPoints} P</p>
          </div>

          {/* 회복량 조절 */}
          <div className="flex items-center gap-4 w-full justify-center">
            <Button 
              variant="outline" 
              onClick={handleDecrease}
              disabled={recoveryAmount <= 10}
              className="rounded-full w-10 h-10 p-0"
            >
              <Minus size={20} />
            </Button>
            
            <div className="text-center w-32">
              <p className="text-3xl font-bold text-blue-600">{recoveryAmount}%</p>
              <p className="text-sm text-gray-500">회복량</p>
            </div>

            <Button 
              variant="outline" 
              onClick={handleIncrease}
              disabled={recoveryAmount >= 100}
              className="rounded-full w-10 h-10 p-0"
            >
              <Plus size={20} />
            </Button>
          </div>

          {/* 필요 포인트 표시 */}
          <div className="text-center">
            <p className="text-lg mb-2 jua-regular">소비 포인트</p>
            <p className="text-2xl font-bold text-red-600">{pointsNeeded} P</p>
          </div>

          {/* 회복 버튼 */}
          <Button 
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={pointsNeeded > currentPoints}
          >
            포인트로 회복하기
          </Button>

          {pointsNeeded > currentPoints && (
            <p className="text-red-500 text-sm">
              포인트가 부족합니다
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default PointRecoveryPopup; 