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
import User from './components/test/User';
import RankingPage from './components/RankingPage';
import DungeonCanvas from './components/Game/DungeonCanvas';
import MountainCanvas from './components/Game/MountainCanvas';
import RuinsCanvas from './components/Game/RuinsCanvas';
import PageLoader from './components/PageLoader';
import Writing from "./components/Community/Writing.jsx";

import WelcomeMessage from './components/WelcomeMessage';
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
        <Route path="/community/writing" element={<Writing />} />
        <Route path='/dailyQuiz' element={<DailyQuiz />} />
        <Route path="/users/:id" element={<User />} />
        <Route path='/ranking' element={<RankingPage />} />
        <Route path='/Test' element={<User />} />
        <Route path='/dungeon' element={<DungeonCanvas />} />
        <Route path='/mountain' element={<MountainCanvas />} />
        <Route path='/ruins' element={<RuinsCanvas />} />
        <Route path='/loading' element={<PageLoader />} />
        <Route path='/demo' element={<WelcomeMessage />} />
      </Routes>
    </Router>
  );
}

export default App;
