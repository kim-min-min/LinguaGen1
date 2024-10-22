import React, { useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';


import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import '../App.css';
import Stars from './Stars';
import Overlay from './Overlay';
import useStore from '../store/useStore';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


function LoginPage() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSignupState = searchParams.get('signup') === 'true';
  // 로그인 관련 상태 관리
  const [fadeIn, setFadeIn] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(initialSignupState); // 회원가입 폼 표시 여부
  const [showSignupNext, setShowSignupNext] = useState(false); // SignupNext 표시 여부
  const [signupFormData, setSignupFormData] = useState({});
  const navigate = useNavigate();
  const { setIsLoggedIn } = useStore();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // Google에서 받은 JWT 토큰 디코딩
      const decoded = jwt_decode(credentialResponse.credential);
      console.log('Google User Info:', decoded);

      // 토큰을 서버로 전송해 세션 설정 요청 (withCredentials 사용)
      const response = await axios.post(
          'http://localhost:8085/api/google-login',
          { token: credentialResponse.credential },
          { withCredentials: true } // 서버와의 세션 쿠키 포함 요청
      );

      if (response.status === 200) {
        alert('로그인 성공!');
        navigate('/main'); // 메인 페이지로 이동
      } else {
        setError('Google 로그인 처리 중 문제가 발생했습니다.');
      }
    } catch (err) {
      console.error('Google 로그인 중 오류:', err);
      setError('Google 로그인에 실패했습니다.');
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    try {
      const response = await axios.post(
          'http://localhost:8085/api/users/login', // API 엔드포인트
          { id, password }, // 요청 데이터 (아이디와 비밀번호)
          { withCredentials: true } // 세션 쿠키 포함
      );

      // 응답이 성공적인 경우 처리
      if (response.status === 200 && response.data === '로그인 성공') {
        alert('로그인 성공!');
        navigate('/main'); // 메인 페이지로 이동
      } else {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (err) {
      console.error('에러 발생:', err);
      setError('로그인 중 오류가 발생했습니다.'); // 에러 메시지 출력
    }
  };


  const handleSignupToggle = () => {
    setShowSignup(!showSignup); // 회원가입 폼 표시 토글
  };

  const handleNextSignup = (formData) => {
    console.log("Signup formData: ", formData);
    setSignupFormData(formData); // Signup에서 전달받은 데이터를 저장
    setShowSignupNext(true); // SignupNext로 이동
  };

  const handlePreviousSignup = () => {
    setShowSignupNext(false); // 이전 버튼 누르면 Signup 페이지로 돌아가게 함
  };

  useState(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
      <GoogleOAuthProvider clientId="970913932285-p2khbpep1qnkug3d5l2tqht45tc72lc5.apps.googleusercontent.com">
        <div
            style={{ width: '100vw' }}
            className={`login-page-container w-full h-screen grid lg:grid-cols-2 ${
                fadeIn ? 'fade-in' : ''
            } overflow-scroll lg:overflow-hidden`}
        >
          <div className="flex items-center justify-center py-12 bg-white">
            {showSignupNext ? (
                <SignupNext onPreviousSignup={handlePreviousSignup} formData={signupFormData} />
            ) : showSignup ? (
                <Signup onSignupToggle={handleSignupToggle} onNextSignup={handleNextSignup} />
            ) : (
                <div className="mx-auto grid w-[350px] gap-6">
                  <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">로그인</h1>
                    <p className="text-sm text-gray-500">
                      {error && <span className="text-red-500">{error}</span>}
                    </p>
                  </div>
                  <form onSubmit={handleLogin} className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="id">아이디</Label>
                      <Input
                          id="id"
                          type="text"
                          placeholder="ID"
                          required
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">비밀번호</Label>
                        <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                          비밀번호를 잊으셨나요?
                        </Link>
                      </div>
                      <Input
                          id="password"
                          type="password"
                          placeholder="PASSWORD"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      로그인
                    </Button>

                    {/* Google 로그인 버튼 */}
                    <div className="w-full text-center mt-4">
                      <GoogleLogin
                          onSuccess={handleLoginSuccess}
                          onError={handleLoginFailure}
                          theme="outline"
                          size="large"
                          text="signin_with"
                      />
                    </div>
                  </form>

                  <div className="mt-4 text-center text-sm">
                    아직 계정이 없으신가요?{' '}
                    <span onClick={handleSignupToggle} className="underline cursor-pointer">
                회원가입
              </span>
                  </div>
                </div>
            )}
          </div>

          <div className="relative w-full h-full" style={{ backgroundColor: '#12071f' }}>
            <Stars className="w-full h-full" />
            <Overlay />
          </div>
        </div>
      </GoogleOAuthProvider>
  );

}




// Signup 컴포넌트
function Signup({ onSignupToggle, onNextSignup }) {

  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    detailedAddress: '',
  });

  const [error, setError] = useState(''); // 에러 메시지 상태

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 유효성 검사
  const validate = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNextSignup(formData); // 폼 데이터 전달
    }
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">회원가입</h1>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            name="id"
            type="email"
            placeholder="example@example.com"
            value={formData.id}
            onChange={handleChange} // onChange 핸들러 추가
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            name="password"
            value={formData.password}
            type="password"
            placeholder="대문자, 소문자 포함 8자리 이상"
            onChange={handleChange} // onChange 핸들러 추가
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleChange} // onChange 핸들러 추가
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">전화번호</Label>
          <Input
            name="phone"
            type="tel"
            placeholder="전화번호 입력"
            value={formData.phone}
            onChange={handleChange} // onChange 핸들러 추가
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex gap-2">
            <Input
              name="address"
              type="text"
              value={formData.address}
              placeholder="주소"
              onChange={handleChange} // onChange 핸들러 추가
            />
            <Button variant="outline">주소 검색</Button>
          </div>
          <Input
            name="detailedAddress"
            type="text"
            value={formData.detailedAddress}
            placeholder="상세 주소"
            onChange={handleChange} // onChange 핸들러 추가
          />
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Next
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <span onClick={onSignupToggle} className="underline cursor-pointer">
          로그인으로 돌아가기
        </span>
      </div>
    </div>
  );
}

// SignupNext 컴포넌트
function SignupNext({ formData, onPreviousSignup }) {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(33); // 초기 값 33
  const [selectedInterests, setSelectedInterests] = useState([]); // 관심사 선택 상태

  const getTier = () => {
    if (sliderValue < 49) return "Bronze";
    if (sliderValue < 80) return "Silver";
    return "Gold";
  };

  // ToggleGroup에서 선택된 항목 업데이트
  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest) // 이미 선택된 경우 제거
        : [...prev, interest] // 선택된 경우 추가
    );
  };



// 회원가입 완료 처리
  const handleSignupComplete = async () => {
    try {
      // 주소 합치기
      const fullAddress = `${formData.address} ${formData.detailedAddress}`.trim();

      // completeFormData 객체에 모든 필수 데이터를 모아줍니다.
      const completeFormData = {
        id: formData.id,
        password: formData.password,
        name: formData.name, // 예시로 이름 추가
        phone: formData.phone, // 전화번호 필드 추가
        address: fullAddress,
      };

      // 회원가입 정보 로그로 출력
      console.log("회원가입 정보:", completeFormData);

      // axios로 POST 요청 전송
      const response = await axios.post('http://localhost:8085/api/users', completeFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        alert('회원가입이 완료되었습니다!');
        navigate('/main'); // 메인 페이지로 이동
      } else {
        console.warn('회원가입 실패:', response.data);
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      // 오류 처리: 서버와의 통신 문제와 요청 오류를 구분
      if (error.response) {
        console.error('회원가입 중 서버 오류 발생:', error.response.data);
        alert(`회원가입 실패: ${error.response.data.message || '서버 오류'}`);
      } else if (error.request) {
        console.error('서버 응답 없음:', error.request);
        alert('서버와 통신할 수 없습니다. 나중에 다시 시도해주세요.');
      } else {
        console.error('회원가입 요청 설정 중 오류 발생:', error.message);
        alert('회원가입 요청 처리 중 문제가 발생했습니다.');
      }
    }
  };


  return (
    <div className="flex justify-center items-center w-2/3 h-auto">
      <div className='w-full h-auto p-12 flex flex-col justify-center items-center mt-16'>
        <p className='font-bold text-xl'>좋아하는 관심사를 골라주세요</p>
        <ToggleGroup type="multiple" variant='outline' className='grid grid-cols-6 mt-12 gap-4'>
          <ToggleGroupItem value='movie' className='col-span-2' onClick={() => handleInterestChange('movie')}>영화</ToggleGroupItem>
          <ToggleGroupItem value='dailySpeech' className='col-span-2' onClick={() => handleInterestChange('dailySpeech')}>일상회화</ToggleGroupItem>
          <ToggleGroupItem value='travel' className='col-span-2' onClick={() => handleInterestChange('travel')}>여행</ToggleGroupItem>
          <ToggleGroupItem value='business' className='col-start-2 col-span-2' onClick={() => handleInterestChange('business')}>비지니스</ToggleGroupItem>
          <ToggleGroupItem value='drama' className='col-start-4 col-span-2' onClick={() => handleInterestChange('drama')}>드라마</ToggleGroupItem>
          <ToggleGroupItem value='anime' className='col-span-2' onClick={() => handleInterestChange('anime')}>애니</ToggleGroupItem>
          <ToggleGroupItem value='normal' className='col-start-3 col-span-2' onClick={() => handleInterestChange('normal')}>일반</ToggleGroupItem>
          <ToggleGroupItem value='literature' className='col-start-5 col-span-2' onClick={() => handleInterestChange('literature')}>문학</ToggleGroupItem>
        </ToggleGroup>

        <div className='mt-20 flex flex-col justify-center items-center w-full'>
          <p className='font-bold text-xl'>당신의 실력을 알려주세요</p>
          <div className='w-full h-[350px] flex flex-col justify-start items-center'>
            <div className='w-full flex flex-row justify-between mt-24'>
              <div className='flex flex-col justify-center items-center'>
                <TooltipProvider >
                  <Tooltip >
                    <TooltipTrigger className='bg-transparent'>
                      <img src="src/assets/imgs/info.png" alt="이미지를 불러올 수 없습니다." className='w-8 h-8 mb-4' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>브론즈</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p>Bronze</p>
                <img src="src/assets/imgs/down.png" alt="이미지를 불러올 수 없습니다" className='w-8 h-8 mt-4' />
              </div>
              <div className='flex flex-col justify-center items-center'>
                <TooltipProvider >
                  <Tooltip >
                    <TooltipTrigger className='bg-transparent'>
                      <img src="src/assets/imgs/info.png" alt="이미지를 불러올 수 없습니다." className='w-8 h-8 mb-4' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>실버</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p>Silver</p>
                <img src="src/assets/imgs/down.png" alt="이미지를 불러올 수 없습니다" className='w-8 h-8 mt-4' />
              </div>
              <div className='flex flex-col justify-center items-center'>
                <TooltipProvider >
                  <Tooltip >
                    <TooltipTrigger className='bg-transparent'>
                      <img src="src/assets/imgs/info.png" alt="이미지를 불러올 수 없습니다." className='w-8 h-8 mb-4' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>골드</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <p>Gold</p>
                <img src="src/assets/imgs/down.png" alt="이미지를 불러올 수 없습니다" className='w-8 h-8 mt-4' />
              </div>
            </div>
            <Slider
              defaultValue={[33]}
              value={[sliderValue]}
              max={100}
              step={1}
              className='mt-4'
              onValueChange={(value) => setSliderValue(value[0])}
            />
            <p className='mt-4'>{getTier()}</p>
          </div>
          <div className='w-full h-auto flex flex-row justify-center gap-4'>
            <Button onClick={onPreviousSignup}>이전</Button>
            <Button onClick={handleSignupComplete}>가입 완료</Button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default LoginPage;
