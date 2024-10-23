"use client";

import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {Card, CardHeader, CardContent} from "@/components/ui/card";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import BronzeTier from "../../assets/imgs/Tiers/Bronze Tier.png";
import SilverTier from "../../assets/imgs/Tiers/Silver Tier.png";
import GoldTier from "../../assets/imgs/Tiers/Gold Tier.png";
import PlatinumTier from "../../assets/imgs/Tiers/Platinum Tier.png";
import DiamondTier from "../../assets/imgs/Tiers/Diamond Tier.png";
import ChellengerTier from "../../assets/imgs/Tiers/Chellenger Tier.png";

import {Separator} from "@/components/ui/separator";
import useStore from '../../store/useStore';
import "../../App.css";


function ProfileCard() {
  const {isLoggedIn, setIsLoggedIn} = useStore();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [userGrade, setUserGrade] = useState(null);
  const [userGradeString, setUserGradeString] = useState(null);
  const [userTier, setUserTier] = useState(null);

  const gradeNames = {
    1: "Bronze",
    2: "Silver",
    3: "Gold",
    4: "Platinum",
    5: "Diamond",
    6: "Chellenger"
  };

  const tierImages = {
    1: BronzeTier,
    2: SilverTier,
    3 : GoldTier,
    4 : PlatinumTier,
    5 : DiamondTier,
    6 : ChellengerTier
  };

  const getGradeMessage = (grade) => {
    switch(grade) {
      case "Bronze": return "좀 더 분발해보세요!";
      case "Silver": return "잘 하고 있어요!";
      case "Gold": return "훌륭합니다!";
      case "Platinum": return "대단해요!";
      case "Diamond": return "최고의 실력이에요!";
      case "Chellenger": return "당신은 챔피언입니다!";
      default: return "계속 노력하세요!";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = sessionStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
        const userData = JSON.parse(user);
        try {
          // 사용자 정보 가져오기
          const userResponse = await axios.get(`http://localhost:8085/api/users/${userData.id}`, {withCredentials: true});
          setUserInfo(userResponse.data);

          // 사용자의 등급 정보 가져오기
          const gradeResponse = await axios.get(`http://localhost:8085/api/grade/${userData.id}`, {withCredentials: true});
          const numericGrade = gradeResponse.data.grade;
          setUserGrade(numericGrade);
          setUserGradeString(gradeNames[numericGrade] || "알 수 없음");
          setUserTier(gradeResponse.data.tier);
        } catch (error) {
          console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        }
      }
    };

    fetchUserData();
  }, [setIsLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
          'http://localhost:8085/api/users/login',
          {id, password},
          {withCredentials: true}
      );

      if (response.status === 200 && response.data === '로그인 성공') {
        alert('로그인 성공!');
        sessionStorage.setItem('user', JSON.stringify({id}));
        setIsLoggedIn(true);

        // 로그인 성공 후 사용자 정보와 등급 정보 가져오기
        try {
          const userResponse = await axios.get(`http://localhost:8085/api/users/${id}`, {withCredentials: true});
          setUserInfo(userResponse.data);

          const gradeResponse = await axios.get(`http://localhost:8085/api/grade/${id}`, {withCredentials: true});
          setUserGrade(gradeResponse.data.grade);
          setUserTier(gradeResponse.data.tier);
        } catch (error) {
          console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        }

        navigate('/main');
      } else {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (err) {
      console.error('에러 발생:', err);
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('user'); // 세션에서 사용자 정보 삭제
    // 필요한 경우 추가적인 로그아웃 로직을 여기에 구현할 수 있습니다.
    // 예: 로컬 스토리지 클리어, 서버에 로그아웃 요청 등
  };

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
              <br/>
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
            <AvatarImage src="https://github.com/shadcn.png"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="mr-4 flex flex-col gap-8">
            <ContextMenu>
              <ContextMenuTrigger className="text-lg font-bold">{userInfo.id}</ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>수정하기</ContextMenuItem>
                <ContextMenuItem onClick={handleLogout}>로그아웃</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <HoverCard>
              <HoverCardTrigger
                  style={{textDecoration: "none", color: "gray", fontWeight: "bold", cursor: "default"}}>
                {userGradeString && userTier ? `${userGradeString} ${userTier}` : 'Grade & Tier'}
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4 flex-col h-64 items-center">
                  <Avatar className="w-36 h-36">
                    <AvatarImage src={userGrade ? tierImages[userGrade] : BronzeTier} />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-center">
                      {userGradeString && userTier ? `${userGradeString} ${userTier}` : '로딩 중...'}
                    </h4>
                    <h3 className="text-md text-center">
                      {userInfo ? `${userInfo.points}pt.` : '로딩 중...'}
                    </h3>
                    <h2 className="text-sm text-center">
                      {userGradeString ? getGradeMessage(userGradeString) : '로딩 중...'}
                    </h2>
                    <div className="flex items-center pt-2">
                                        <span className="text-xs text-muted-foreground">
                                            {userInfo ? `가입일: ${new Date(userInfo.joinDate).toLocaleDateString('ko-KR', {
                                              year: 'numeric',
                                              month: 'long'
                                            })}` : '로딩 중...'}
                                          </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardHeader>
        <Separator className="w-full bg-gray-300"/>
        <CardContent className="flex flex-col items-center justify-center h-60 gap-12">
          <ul className="flex flex-col items-center justify-center gap-12 Texthover font-bold">
            <li>
              <Link to="/mypage" style={{fontWeight: 'bold'}}>마이페이지</Link>
            </li>
            <li>
              <Link to="/dashboard" style={{fontWeight: 'bold'}}>대쉬보드</Link>
            </li>
            <li>
              <Link to="/community" style={{fontWeight: 'bold'}}>커뮤니티</Link>
            </li>
          </ul>
        </CardContent>
      </Card>
  );
}

export default ProfileCard;
