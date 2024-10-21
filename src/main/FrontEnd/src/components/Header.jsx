import React from 'react'
import { useNavigate } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Trophy from '../assets/imgs/Trophy.png';
import dayily from '../assets/imgs/day.png';
import chatbot from '../assets/imgs/chatbot.png';
import home from '../assets/imgs/home.png' 

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
      <img src={home} alt="MainLogo" style={{ width: '35px', height: '35px', cursor : 'pointer',marginLeft : '25px' }} onClick={handleLogoClick}/>
    </div>
    <div className='flex w-full justify-end mr-16'>
    <HoverCard>    
      <HoverCardTrigger><img src={chatbot} alt="chatbot" style={{ width: '35px', height: '35px', marginRight: '20px' }} /></HoverCardTrigger>
      <HoverCardContent className='w-34'> 챗봇 이용하기</HoverCardContent>
    </HoverCard>
    <HoverCard>  
      <HoverCardTrigger><img src={dayily} alt="dayily" style={{ width: '35px', height: '35px', marginRight: '20px', cursor : 'pointer' }} onClick={handleDailyQuizClick}/></HoverCardTrigger>
      <HoverCardContent className='w-34'> 데일리 퀴즈</HoverCardContent>
    </HoverCard>
    <HoverCard> 
      <HoverCardTrigger><img src={Trophy} alt="Trophy" style={{ width: '35px', height: '35px', cursor : 'pointer' }} onClick={handleRankingClick} /></HoverCardTrigger>
      <HoverCardContent className='w-34'> 랭킹 페이지</HoverCardContent>
    </HoverCard>
    </div>
  </header>
  )
}

export default Header