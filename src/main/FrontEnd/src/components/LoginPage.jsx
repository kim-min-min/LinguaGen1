import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import '../App.css';
import Stars from './Stars';
import Overlay from './Overlay';
import useStore from '../store/useStore';

function LoginPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useStore();

  // 간단한 로그인 로직을 위한 하드코딩된 사용자 정보
  const validUser = {
    id: "test",
    password: "test"
  };

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === validUser.id && password === validUser.password) {
      setIsLoggedIn(true);
      setError("");
      navigate('/main'); // 로그인 성공 시 MainPage로 이동
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div 
    style={{width : '100vw'}}
    className={`login-page-container w-full h-screen grid lg:grid-cols-2 ${fadeIn ? 'fade-in' : ''} overflow-scroll lg:overflow-hidden`}>
      {/* Login Form 컨테이너 */}
      <div className="flex items-center justify-center py-12 bg-white">
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
                placeholder="아이디"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
            <Button variant="outline" className="w-full">
              Google 로 로그인하기
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            아직 계정이 없으신가요?{" "}
            <Link to="/signup" className="underline">
              회원가입
            </Link>
          </div>
        </div>
      </div>

      {/* Stars 및 Overlay 컨테이너 */}
      <div 
      className="relative w-full h-full"
      style={{backgroundColor : '#12071f'}}
      >
        <Stars className="w-full h-full" />
        <Overlay />
      </div>
    </div>
  );
}

export default LoginPage;
