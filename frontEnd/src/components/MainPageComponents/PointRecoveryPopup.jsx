import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from "lucide-react";

function PointRecoveryPopup({ onClose }) {
  const [recoveryAmount, setRecoveryAmount] = useState(10); // 기본값 10%
  const [currentPoints, setCurrentPoints] = useState(0);
  const pointsNeeded = (recoveryAmount / 10) * 100; // 10% 당 100포인트

// 사용자의 포인트 데이터를 가져오는 useEffect
  useEffect(() => {
    async function fetchUserPoints() {
      try {
        const userId = sessionStorage.getItem("id");
        if (userId) {
          const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/users/getPoints?userId=${userId}`);

          if (response.ok) {
            const data = await response.json();
            setCurrentPoints(data);
          } else {
            console.error("Failed to fetch user points:", response.statusText);
          }
        } else {
          console.error("User ID not found in session storage");
        }
      } catch (error) {
        console.error("Failed to fetch user points:", error);
      }
    }
    fetchUserPoints();
  }, []);

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

  // 포인트로 회복하기 버튼 클릭 시 실행되는 함수
  const handleRecovery = async () => {
    try {
      const userId = sessionStorage.getItem("id");
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/game/recoverFatigue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          recoveryAmount: recoveryAmount
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPoints(data.updatedPoints); // 서버에서 반환된 최신 포인트로 업데이트
        alert("피로도가 회복되었습니다!");
        onClose(); // 팝업 닫기
      } else {
        console.error("Recovery failed:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to recover points:", error);
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
            onClick={handleRecovery}
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