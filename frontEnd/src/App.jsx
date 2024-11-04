import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageLoader from './components/PageLoader.jsx';
import LoadingSpiner from './components/LoadingSpiner.jsx';
import './styles/global.css';

// Lazy loading components
const LandingPage = lazy(() => import('./components/LandingPage.jsx'));
const LoginPage = lazy(() => import('./components/LoginPage.jsx'));
const MainPage = lazy(() => import('./components/MainPage.jsx'));
const DashBoard = lazy(() => import('./components/DashBoard/DashBoard.jsx'));
const MyPage = lazy(() => import('./components/MyPage/MyPage.jsx'));
const Community = lazy(() => import('./components/Community/Community.jsx'));
const DailyQuiz = lazy(() => import('./components/DailyQuiz.jsx'));
const User = lazy(() => import('./components/Test/User.jsx'));
const RankingPage = lazy(() => import('./components/RankingPage.jsx'));
const DungeonCanvas = lazy(() => import('./components/Game/DungeonCanvas.jsx'));
const MountainCanvas = lazy(() => import('./components/Game/MountainCanvas.jsx'));
const RuinsCanvas = lazy(() => import('./components/Game/RuinsCanvas.jsx'));
const Writing = lazy(() => import('./components/Community/Writing.jsx'));
const WelcomeMessage = lazy(() => import('./components/WelcomeMessage.jsx'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpiner />}>
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
          <Route path="/community/:board" element={<Community />} />
          <Route path="/community/:board/detailview/:idx" element={<Community />} />
          <Route path="/community/:board/detailview" element={<Community />} />
          <Route path='/community/:board/writing' element={<Community />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
