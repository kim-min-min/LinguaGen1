import React from 'react'
import { useNavigate } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Trophy from '../assets/imgs/Trophy.png';
import dayily from '../assets/imgs/day.png';
import chatbot from '../assets/imgs/chatbot.png';
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
    <header className='w-full h-16 flex items-center justify-between pt-4 mb-4 pb-4 border-b-2 border-gray-300 shadow-md bg-white'>
      <div className='flex w-full items-center justify-start'>
        <img src={home} alt="MainLogo" style={{ width: '35px', height: '35px', cursor: 'pointer', marginLeft: '25px' }} onClick={handleLogoClick} />
      </div>
      <div className='flex w-full justify-end mr-16'>
        <Sheet>
          <SheetTrigger className='p-0 m-0 bg-transparent'>
            <HoverCard>
              <HoverCardTrigger><img src='src/assets/imgs/notification-bell.png' alt="alarm" style={{ width: '35px', height: '35px', marginRight: '20px', cursor: 'pointer' }} /></HoverCardTrigger>
              <HoverCardContent className='w-34'> 알람</HoverCardContent>
            </HoverCard>
          </SheetTrigger>
          <SheetContent side='left'>
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
        <HoverCard>
          <HoverCardTrigger><img src={chatbot} alt="chatbot" style={{ width: '35px', height: '35px', marginRight: '20px' }} /></HoverCardTrigger>
          <HoverCardContent className='w-34'> 챗봇 이용하기</HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger><img src={dayily} alt="dayily" style={{ width: '35px', height: '35px', marginRight: '20px', cursor: 'pointer' }} onClick={handleDailyQuizClick} /></HoverCardTrigger>
          <HoverCardContent className='w-34'> 데일리 퀴즈</HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger><img src={Trophy} alt="Trophy" style={{ width: '35px', height: '35px', cursor: 'pointer' }} onClick={handleRankingClick} /></HoverCardTrigger>
          <HoverCardContent className='w-34'> 랭킹 페이지</HoverCardContent>
        </HoverCard>
      </div>
    </header>
  )
}

export default Header