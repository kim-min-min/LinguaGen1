import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator"
import home from '../assets/imgs/home.png'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Header = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const logoText = "LinguaGen";
  
  const handleLogoClick = () => {
    navigate('/main');
  };

  const handleDailyQuizClick = () => {
    navigate('/dailyQuiz');
  }

  const handleRankingClick = () => {
    navigate('/ranking');
  }

  return (
    <>
      <div 
        className='w-full h-4 fixed top-0 left-0 z-50 group'
        style={{ backgroundColor: 'transparent' }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <header 
          className='w-full h-16 flex items-center justify-between pt-4 pb-4 shadow-xl bg-[#4fb0e0] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out'
        >
          <div className='w-full flex items-center justify-between px-8'>
            {/* 왼쪽 로고 */}
            <div className='flex-1'>
              <img 
                src={home} 
                alt="MainLogo" 
                style={{ width: '35px', height: '35px', cursor: 'pointer' }} 
                onClick={handleLogoClick} 
              />
            </div>

            {/* 가운데 메인 로고 */}
            <div className='flex-1 flex justify-center'>
              <h1 
                className='text-white text-2xl press-start-2p-regular cursor-pointer relative' 
                onClick={handleLogoClick}
                style={{
                  textShadow: `
                    0 1px 0 #2980b9,
                    0 2px 0 #2472a4,
                    0 3px 0 #1a5276,
                    0 4px 0 #154360,
                    0 5px 0 #11334d,
                    0 6px 1px rgba(0,0,0,.1),
                    0 0 5px rgba(0,0,0,.1),
                    0 1px 3px rgba(0,0,0,.3),
                    0 3px 5px rgba(0,0,0,.2),
                    0 5px 10px rgba(0,0,0,.25),
                    0 10px 10px rgba(0,0,0,.2),
                    0 20px 20px rgba(0,0,0,.15)
                  `,
                  transform: 'translateZ(0)',
                  WebkitFontSmoothing: 'antialiased'
                }}
              >
                {isVisible ? (
                  <div className="flex">
                    {logoText.split('').map((char, index) => (
                      <span
                        key={index}
                        className="inline-block opacity-0"
                        style={{
                          animation: `popIn 0.3s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="opacity-0">LinguaGen</div>
                )}
              </h1>
            </div>

            {/* 오른쪽 아이콘들 */}
            <div className='flex-1 flex justify-end items-center gap-5'>
              
              <p className='text-white text-sm press-start-2p-regular cursor-pointer hover:text-gray-400 transition-colors duration-300' >ChatBot</p>
              <p className='text-white text-sm press-start-2p-regular cursor-pointer hover:text-gray-400 transition-colors duration-300' onClick={handleDailyQuizClick}>Daily-Quiz</p>
              <p className='text-white text-sm press-start-2p-regular cursor-pointer hover:text-gray-400 transition-colors duration-300' onClick={handleRankingClick}>Ranking</p>
              <Separator orientation='vertical' className='h-8 bg-white' />
              <Sheet>
                <SheetTrigger className='p-0 m-0 bg-transparent'>
                  <HoverCard>
                    <HoverCardTrigger>
                      <img 
                        src='src/assets/imgs/notification-bell.png' 
                        alt="alarm" 
                        className='w-[35px] h-[35px] cursor-pointer'
                      />
                    </HoverCardTrigger>
                    <HoverCardContent className='w-34'>알람</HoverCardContent>
                  </HoverCard>
                </SheetTrigger>
                <SheetContent side='right'>
                  <SheetHeader>
                    <SheetTitle>알람</SheetTitle>
                    <SheetDescription>알람 내용</SheetDescription>
                  </SheetHeader>
                  <div className='flex flex-col items-center justify-center'>
                    <Table className='mt-12'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[20px]">No</TableHead>
                          <TableHead>보낸 사람</TableHead>
                          <TableHead>내용</TableHead>
                          <TableHead className="text-right">Y/N</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">01</TableCell>
                          <TableCell>Scarpula</TableCell>
                          <TableCell>
                            <HoverCard>
                              <HoverCardTrigger>
                                {(() => {
                                  const content = "저랑 같이 단체전 ㄱ?ㅇㅇㅇㅇㅇㅇㅇㅇㅁㄴㅇㅁㄴㅇㅁㅇㄴ";
                                  return (
                                    <span>
                                      {content.length > 15 ? content.slice(0, 9) + '...' : content}
                                    </span>
                                  );
                                })()}
                              </HoverCardTrigger>
                              <HoverCardContent>
                              저랑 같이 단체전 ㄱ?ㅇㅇㅇㅇㅇㅇㅇㅇㅁㄴㅇㅁㄴㅇㅁㅇㄴ
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>
                          <TableCell className="text-right flex flex-row">
                            <Button className='w-8 h-8 hover:bg-green-500'>Y</Button>
                            <Button className='w-8 h-8 hover:bg-red-500'>N</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      </div>
      {/* 헤더 높이만큼의 여백 */}
      <div className='w-full h-24'></div>

      {/* CSS 애니메이션 추가 */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default Header
