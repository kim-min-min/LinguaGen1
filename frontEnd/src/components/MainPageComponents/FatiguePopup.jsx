import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PointRecoveryPopup from './PointRecoveryPopup';
import MockAdComponent from '../MockAdComponent';
import useStore from '../../store/useStore';

function FatiguePopup({ onClose }) {
  const [showPointRecovery, setShowPointRecovery] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const { fatigue, setFatigue } = useStore();

  const handleAdComplete = () => {
    // 피로도 20% 감소
    setFatigue(Math.max(0, fatigue - 20));
    setShowAd(false);
    // 추가로 성공 메시지나 애니메이션을 표시할 수 있습니다
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-[800px] relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold mb-6 text-center jua-regular">
            피로도가 가득 찼습니다!
          </h2>
          <p className="text-gray-600 mb-8 text-center jua-regular">
            다음 방법 중 하나를 선택하여 게임을 계속하세요
          </p>
          
          <div className="grid grid-cols-3 gap-8">
            {/* 광고 시청 카드 */}
            <Card className="p-6 bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">📺</div>
                <h3 className="font-bold text-lg text-center jua-regular">광고 시청하기</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  30초 광고를 시청하고 피로도를 20% 감소시키세요
                </p>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => setShowAd(true)}
                >
                  광고 보기
                </Button>
              </div>
            </Card>

            {/* 포인트 사용 카드 */}
            <Card className="p-6 bg-green-100 hover:bg-green-200 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">💎</div>
                <h3 className="font-bold text-lg text-center jua-regular">포인트 사용하기</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  포인트로 원하는 만큼 피로도를 회복하세요
                </p>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => setShowPointRecovery(true)}
                >
                  포인트 사용
                </Button>
              </div>
            </Card>

            {/* Pro 업그레이드 카드 */}
            <Card className="p-6 bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">⭐</div>
                <h3 className="font-bold text-lg text-center jua-regular">Pro로 업그레이드</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Pro 회원이 되어 무제한으로 게임을 즐기세요
                </p>
                <Link to="/upgrade">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    Pro 되기
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 포인트 회복 팝업 */}
      {showPointRecovery && (
        <PointRecoveryPopup onClose={() => setShowPointRecovery(false)} />
      )}

      {showAd && (
        <MockAdComponent 
          onClose={() => setShowAd(false)}
          onAdComplete={handleAdComplete}
        />
      )}
    </>
  );
}

export default FatiguePopup; 