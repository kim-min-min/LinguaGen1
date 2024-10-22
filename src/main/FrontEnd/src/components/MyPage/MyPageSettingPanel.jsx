import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@components/ui/button";
import styled from 'styled-components';
import NotificationPanel from './NotificationPanel'; // NotificationPanel import
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// 탭 컨테이너 및 슬라이드 스타일 정의
const TabContainer = styled.div`
  position: relative;
  width: 100%;
  border-bottom: 2px solid #e2e8f0; /* 기본 border */
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
`;

const Tab = styled.div`
  width: 160px; /* 고정 너비 */
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  padding: 8px 0;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? '#bbf7d0' : 'black')}; /* 활성화된 탭 색상 */
  transition: color 0.3s ease;
  user-select: none;
    &:hover {
    color: ${({ isActive }) => (isActive ? '#bbf7d0' : '#bbf7d0')}; /* hover 상태에서 색상 변경 */
  }
`;

const Slider = styled.div`
  position: absolute;
  bottom: 0;
  left: ${({ activeTab }) => (activeTab === 'profile' ? '0px' : '160px')}; /* 슬라이더 위치 조정 */
  width: 160px;
  height: 4px;
  background-color: #00b894; /* 연두색 */
  transition: left 0.3s ease; /* 슬라이드 애니메이션 */
`;

const MyPageSettingPanel = ({ activePanel, setActivePanel }) => {
    const activeTab = activePanel === 'accountSettings' ? 'profile' : 'notification';
    const [selectedImage, setSelectedImage] = useState('https://via.placeholder.com/60'); // 기본 이미지 URL

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // 선택한 이미지 URL 설정
            };
            reader.readAsDataURL(file); // 이미지 파일 읽기
        }
    };

    const triggerFileInput = () => {
        document.getElementById('imageInput').click(); // 파일 선택 창 열기
    };

    return (
        <div className='flex flex-col items-center justify-start w-full min-h-screen pb-14 mt-16 ml-24 pt-4 border-2 border-gray-300 rounded-lg'
            style={{ backdropFilter: 'blur(15px)', background: 'rgba(255, 255, 255, 0.2' }}
        >
            {/* 탭 부분 */}
            <TabContainer>
                <Tab
                    isActive={activeTab === 'profile'}
                    onClick={() => setActivePanel('accountSettings')}
                >
                    계정 정보
                </Tab>
                <Tab
                    isActive={activeTab === 'notification'}
                    onClick={() => setActivePanel('notificationSettings')}
                >
                    알림 설정
                </Tab>
                <Slider activeTab={activeTab} /> {/* 슬라이더 */}
            </TabContainer>

            {/* 패널 내용 */}
            <div className='w-full mt-8' style={{ maxHeight: '720px', height: '420px' }}>
                {activeTab === 'profile' && (
                    <>
                        <Card className='h-full'>
                            <CardHeader className='text-xl font-bold'>
                                <p className='pl-8 pt-4'>내 프로필</p>
                            </CardHeader>
                            <CardContent className='flex flex-col'>
                                <div className='p-8 pt-0 w-full flex justify-start'>
                                    <p className='font-bold'>이미지</p>
                                    <img
                                        src={selectedImage} // 선택된 이미지
                                        alt="프로필"
                                        className='ml-32 h-32 w-36 rounded-md cursor-pointer'
                                        onClick={triggerFileInput} // 이미지 클릭 시 파일 선택 창 열기
                                    />
                                    {/* 파일 입력 요소 숨김 */}
                                    <input
                                        id="imageInput"
                                        type="file"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleImageChange} // 이미지 선택 시 이벤트 처리
                                    />
                                </div>
                                <div className='p-8 pt-0 w-full flex justify-start'>
                                    <p className='font-bold'>닉네임</p>
                                    <p className='ml-32 font-bold'>Scar Pula</p>
                                </div>
                                <div className='p-8 pt-0 w-full flex justify-start'>
                                    <p className='font-bold'>자기소개</p>
                                    <p className='text-gray-300 ml-28 font-bold'>자기소개를 작성해보세요</p>
                                </div>
                                <div className='p-8  pt-0 w-full flex justify-end'>
                                    <Dialog>
                                        <DialogTrigger className='bg-transparent'>
                                            <Button>설정</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>자기소개 수정</DialogTitle>
                                                <DialogDescription>자기소개를 작성해보세요!</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        자기소개
                                                    </Label>
                                                    <Input id="name" placeholder='자기소개를 작성하세요' className="col-span-3" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                        <div className='w-full mt-4' style={{ maxHeight: '720px', height: '280px' }}>
                            <Card className='h-full mb-42'>
                                <CardHeader className='text-lg font-bold'>
                                    <p className='pl-8 pt-4'>기본 정보</p>
                                </CardHeader>
                                <CardContent className='flex flex-col'>
                                    <div className='p-8 pt-0 pb-0 w-full flex justify-between mb-4'>
                                        <p className='font-bold w-24'>이메일</p>
                                        <p className='mr-40 font-bold'>dltjdeh7745@naver.com</p>
                                        <Dialog>
                                            <DialogTrigger className='bg-transparent w-0 h-0 mb-4'>
                                                <Button>설정</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>이메일 수정</DialogTitle>
                                                    <DialogDescription>수정할 이메일을 적어주세요</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                            이메일
                                                        </Label>
                                                        <Input id="email" placeholder='example@example' className="col-span-3" />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className='p-8 pt-0 pb-0 w-full flex justify-between mb-4'>
                                        <p className='font-bold w-24'>비밀번호</p>
                                        <p className='mr-40 font-bold text-gray-300'> 비밀번호를 설정해주세요</p>
                                        <Dialog>
                                            <DialogTrigger className='bg-transparent w-0 h-0 mb-4'>
                                                <Button>설정</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>비밀번호 설정</DialogTitle>
                                                    <DialogDescription>신중하게 변경하세요!</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="password" className="text-right">
                                                            비밀번호
                                                        </Label>
                                                        <Input id="password" placeholder='8~12자리 대소문자 구분없음' className="col-span-3" />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="confirmPassword" className="text-right">
                                                            비밀번호 확인
                                                        </Label>
                                                        <Input id="confirmPassword" placeholder='비밀번호 재입력' className="col-span-3" />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className='p-8 pt-0 w-full flex justify-between mb-4'>
                                        <p className='font-bold'>전화번호</p>
                                        <p className='mr-48 font-bold'>010-8470-0211</p>
                                        <Dialog>
                                            <DialogTrigger className='bg-transparent w-0 h-0 mb-4'>
                                                <Button>설정</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>전화번호 수정</DialogTitle>
                                                    <DialogDescription>전화번호를 적어주세요!</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="phone" className="text-right">
                                                            전화번호
                                                        </Label>
                                                        <Input id="phone" placeholder='- 없이 작성하세요' className="col-span-3" />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {activeTab === 'notification' && <NotificationPanel />} {/* 알림 설정 탭 */}
            </div>
        </div>
    );
};

export default MyPageSettingPanel;
