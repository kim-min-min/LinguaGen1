import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import './styles/global.css';  // 전역 CSS import
import DashBoard from './components/DashBoard/DashBoard';
import MyPage from './components/MyPage/MyPage';
import Community from './components/Community/Community';
import DailyQuiz from './components/DailyQuiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/community' element={<Community />} />
        <Route path='/dailyQuiz' element={<DailyQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
