import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import styled, { keyframes } from 'styled-components';
import Header from './Header';
import axios from 'axios';

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
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

const impKey = import.meta.env.VITE_APP_IMP_KEY;

function UpgradeBilling({ onClose }) {
  useEffect(() => {
    // jQuery 로드
    const jQueryScript = document.createElement('script');
    jQueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jQueryScript.onload = () => {
      // jQuery 로드 후 Iamport SDK 로드
      const iamportScript = document.createElement('script');
      iamportScript.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.8.js";

      iamportScript.onload = () => {
        if (window.IMP) {
          window.IMP.init(impKey); // 아임포트 인증키 설정
        }
      };
      document.body.appendChild(iamportScript);
    };
    document.body.appendChild(jQueryScript);
  }, []);

  const onProUpgrade = () => {
    if (!window.IMP) {
      alert("결제 모듈이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const totalPrice = 9900;

    const userEmail = sessionStorage.getItem('id'); // 사용자 이메일 ID
    const userNickname = sessionStorage.getItem('nickname'); // 사용자 닉네임
    const userTell = sessionStorage.getItem('tell'); // 사용자 전화번호
    const userAddress = sessionStorage.getItem('address'); // 사용자 주소

    window.IMP.request_pay({
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: `merchant_${new Date().getTime()}`,
      name: 'LinguaGen Pro Membership',
      amount: totalPrice,
      buyer_email: userEmail || 'iamport@siot.do',
      buyer_name: userNickname || '구매자이름',
      buyer_tel: userTell || '010-1234-5678',
      buyer_addr: userAddress || '서울특별시 강남구 삼성동',
      buyer_postcode: '123-456',
      m_redirect_url: `${import.meta.env.VITE_APP_BASE_URL}/main`
    }, async function (rsp) {
      console.log("API Base URL:", import.meta.env.VITE_APP_API_BASE_URL);
      console.log("Request URL:", `${import.meta.env.VITE_APP_API_BASE_URL}/payment/log?userId=${userEmail}&amount=${totalPrice}&status=FAIL&transactionId=${rsp.imp_uid}&paymentMethod=${rsp.pay_method}`);
      if (rsp.success) {
        // 결제 성공 시, 백엔드에 plan 업데이트 API 호출
        try {
          // 1. 회원 플랜 업데이트 API 요청 (기존 URL 형식 유지)
          await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/users/payment/success?userId=${userEmail}`);

          // 2. 결제 로그 기록 API 요청
          await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/payment/log/success`, {
            userId: userEmail,
            amount: rsp.paid_amount,
            status: 'SUCCESS',
            transactionId: rsp.imp_uid,
            paymentMethod: rsp.pay_method,
          });
          alert(`결제가 완료되었습니다. 결제 금액: ${rsp.paid_amount}`);
          window.location.href = '/paymentSuccess';
        } catch (error) {
          console.error("결제 성공 후 plan 업데이트 중 오류 발생:", error);
          alert("결제는 성공했지만 회원 플랜 업데이트에 실패했습니다. 고객센터에 문의하세요.");
        }
      } else {
        try {
          await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/payment/log/fail`, {
            userId: userEmail,
            amount: totalPrice,
            status: 'FAIL',
            transactionId: rsp.imp_uid,
            paymentMethod: rsp.pay_method
          });

          alert(`결제에 실패하였습니다: ${rsp.error_msg}`);
        } catch (error) {
          console.error("결제 실패 로그 기록 중 오류 발생:", error);
          alert("결제가 실패했으며 로그 기록에 문제가 발생했습니다. 고객센터에 문의하세요.");
        }
      }
    });
  };

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
                <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={onProUpgrade}>
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
