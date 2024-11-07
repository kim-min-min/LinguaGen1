import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import styled,{keyframes} from 'styled-components';
import Header from './Header';

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비디오가 화면에 맞도록 커버되도록 설정 */
  z-index: -1; /* 다른 요소 뒤에 배치 */
`;
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
  position: relative;
  animation: ${fadeInAnimation} 1s forwards;
`;

const BillingContainer = styled.div`
  max-width: 1200px;
  width: 950px;
  height: 700px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
`;

function UpgradeBilling({ onClose }) {
  return (
    <MainPageContainer>
        <BackgroundVideo autoPlay muted loop>
        <source src='/assets/video/MainBackground.mp4' type='video/mp4' />
      </BackgroundVideo>
      <Header />
      <div className='flex justify-center items-center'>
        <BillingContainer>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4 jua-regular">멤버십 업그레이드</h2>
          <p className="text-gray-600 jua-regular">당신에게 맞는 플랜을 선택하세요</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Basic Plan */}
          <Card className="p-8 border-2 relative">
            <div className="absolute top-4 right-4 bg-gray-200 px-3 py-1 rounded-full text-sm">
              현재 플랜
            </div>
            <h3 className="text-2xl font-bold mb-4 jua-regular">Basic</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold">₩0</span>
              <span className="text-gray-600">/월</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>하루 10회 게임 플레이</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>기본 통계 확인</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>커뮤니티 이용</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" disabled>
              현재 이용중
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 border-2 border-purple-500 relative bg-purple-50">
            <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
              추천
            </div>
            <h3 className="text-2xl font-bold mb-4 text-purple-600 jua-regular">Pro</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold">₩9,900</span>
              <span className="text-gray-600">/월</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-purple-500" />
                <span>무제한 게임 플레이</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-purple-500" />
                <span>상세 통계 및 분석</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-purple-500" />
                <span>프리미엄 커뮤니티 이용</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-purple-500" />
                <span>광고 없음</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-purple-500" />
                <span>우선 순위 고객 지원</span>
              </li>
            </ul>
            <Button className="w-full bg-purple-500 hover:bg-purple-600">
              Pro로 업그레이드
            </Button>
          </Card>
        </div>
      </BillingContainer>
      </div>
    </MainPageContainer>
  );
}

export default UpgradeBilling; 