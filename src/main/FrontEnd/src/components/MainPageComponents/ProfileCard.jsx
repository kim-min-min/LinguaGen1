"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import BronzeTier from "../../assets/imgs/Tiers/Bronze Tier.png";
import { Separator } from "@/components/ui/separator";
import useStore from '../../store/useStore';
import "../../App.css";

function ProfileCard() {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 상태를 selector 함수를 사용하여 가져옵니다.
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

  // 세션에서 로그인 상태 확인 및 갱신
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true); // 로그인 상태 유지
    } else {
      setIsLoggedIn(false); // 로그아웃 상태 설정
    }
    setLoading(false); // 상태 확인 완료 후 로딩 해제
  }, [setIsLoggedIn]);



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
        sessionStorage.setItem('user', JSON.stringify({ id })); // 세션에 사용자 정보 저장
        setIsLoggedIn(true);
        navigate('/main'); // 메인 페이지로 이동
      } else {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (err) {
      console.error('에러 발생:', err);
      setError('로그인 중 오류가 발생했습니다.'); // 에러 메시지 출력
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8085/api/users/logout', {}, { withCredentials: true });

      // 클라이언트 세션 정보 삭제
      sessionStorage.clear(); // 세션 스토리지 완전히 삭제
      setIsLoggedIn(false);
      navigate('/main'); // 홈 화면으로 이동
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  // 로딩 중일 때 로딩 화면 표시
  if (loading) {
    return <div>Loading...</div>;
  }


  if (!isLoggedIn) {
    return (
        <Card className="w-80 h-106 shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-semibold">로그인</h2>
            <p className="text-sm text-gray-500">
              {error && <span className="text-red-500">{error}</span>}
            </p>
          </CardHeader>
          <CardContent>
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
                  <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                    비밀번호를 잊어버리셨나요?
                  </Link>
                </div>
                <Input
                    id="password"
                    type="password"
                    required
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                로그인
              </Button>
              <Button variant="outline" className="w-full">
                Google 로 로그인
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              아이디가 없으신가요?
              <br />
              <Link to="/login?signup=true" className="underline">
                회원가입 하기
              </Link>
            </div>
          </CardContent>
        </Card>
    );
  }

  return (
      <Card className="w-80 h-96 shadow-xl">
        <CardHeader style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Avatar className="mr-12 w-20 h-20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="mr-4 flex flex-col gap-8">
            <ContextMenu>
              <ContextMenuTrigger className="text-lg font-bold">USERNAME</ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>수정하기</ContextMenuItem>
                <ContextMenuItem onClick={handleLogout}>로그아웃</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <HoverCard>
              <HoverCardTrigger style={{ textDecoration: "none", color: "gray", fontWeight: "bold", cursor: "default" }}>Tier</HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4 flex-col h-64 items-center">
                  <Avatar className="w-36 h-36">
                    <AvatarImage src={BronzeTier} />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-center">브론즈 4티어</h4>
                    <h3 className="text-md text-center">
                      45pt.
                    </h3>
                    <h2 className="text-sm text-center">
                      좀더 분발 해보세요!
                    </h2>
                    <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Joined December 2021
                    </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardHeader>
        <Separator className="w-full bg-gray-300" />
        <CardContent className="flex flex-col items-center justify-center h-60 gap-12">
          <ul className="flex flex-col items-center justify-center gap-12 Texthover font-bold">
            <li>
              <Link to="/mypage" style={{ fontWeight: 'bold' }}>마이페이지</Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ fontWeight: 'bold' }}>대쉬보드</Link>
            </li>
            <li>
              <Link to="/community" style={{ fontWeight: 'bold' }}>커뮤니티</Link>
            </li>
          </ul>
        </CardContent>
      </Card>
  );
}

export default ProfileCard;
