import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import DiceCanvas from './DiceCanvas';
import '../App.css';
import useStore from '../store/useStore';
import DungeonCanvas from './Game/DungeonCanvas';
import RuinsCanvas from './Game/RuinsCanvas';
import MountainCanvas from './Game/MountainCanvas';

const canvases = [DungeonCanvas, RuinsCanvas, MountainCanvas];

function LandingPage() {
  const navigate = useNavigate();
  const {
    isLoaded,
    startTyping,
    isLeaving,
    showDemo,
    welcomeMessage1,
    welcomeMessage2,
    showWelcomeMessage1,
    showWelcomeMessage2,
    setIsLoaded,
    setStartTyping,
    setIsLeaving,
    setShowDemo,
    setWelcomeMessage1,
    setWelcomeMessage2,
    setShowWelcomeMessage1,
    setShowWelcomeMessage2,
  } = useStore();

  const [selectedCanvas, setSelectedCanvas] = useState(null);

  const [showLoader, setShowLoader] = useState(false);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const positions = [
    { top: '5%', left: '40%' },
    { top: '25%', left: '15%' },
    { top: '60%', left: '13%' },
    { top: '80%', left: '38%' },
    { top: '60%', right: '18%' },
    { top: '25%', right: '15%' },
  ];

  const initialTransforms = [
    'translateY(-250%)',
    'translateY(-350%)',
    'translateY(-550%)',
    'translateY(-600%)',
    'translateY(-550%)',
    'translateY(-570%)',
  ];

  const rotationSpeeds = useMemo(() => [
    { x: 0.005, y: 0.005, z: 0.005 },
    { x: -0.005, y: 0.005, z: -0.005 },
    { x: 0.005, y: -0.005, z: 0.005 },
    { x: -0.005, y: -0.005, z: -0.005 },
    { x: 0.005, y: 0.005, z: -0.005 },
    { x: -0.005, y: 0.005, z: 0.005 },
  ], []);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    setTimeout(() => setStartTyping(true), 3400);
  }, [setIsLoaded, setStartTyping]);

  const selectRandomCanvas = useCallback(() => {
    const randomCanvas = canvases[Math.floor(Math.random() * canvases.length)];
    setSelectedCanvas(() => randomCanvas);
    setShowDemo(true);
  }, [setShowDemo]);

  const showWelcomeMessages = useCallback(() => {
    setWelcomeMessage1('링구아젠에 오신걸 환영합니다.');
    setTimeout(() => setShowWelcomeMessage1(true), 100);
    
    setTimeout(() => {
      setShowWelcomeMessage1(false);
      
      setTimeout(() => {
        setWelcomeMessage2('게임을 한번 해볼게요.');
        setTimeout(() => setShowWelcomeMessage2(true), 100);
        
        setTimeout(() => {
          setShowWelcomeMessage2(false);
          setTimeout(selectRandomCanvas, 1000);
        }, 3000);
      }, 1000);
    }, 3000);
  }, [setWelcomeMessage1, setShowWelcomeMessage1, setWelcomeMessage2, setShowWelcomeMessage2, selectRandomCanvas]);

  const handleStartClick = useCallback(() => {
    setIsLeaving(true);
    const maxSlideUpDelay = Math.max(...[0.5, 0.7, 1.3, 1.9, 1.5, 0.9]) * 1000;
    const slideUpDuration = 500;
    const totalSlideUpTime = maxSlideUpDelay + slideUpDuration + 200;

    setTimeout(showWelcomeMessages, totalSlideUpTime);
  }, [setIsLeaving, showWelcomeMessages]);

  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleLoadComplete = () => {
    setShowLoader(false);
    setShowDemo(true);
  };

  if (showLoader) {
    return <PageLoader onLoadComplete={handleLoadComplete} />;
  }

  if (showDemo && selectedCanvas) {
    const SelectedCanvas = selectedCanvas;
    return <SelectedCanvas />;
  }

  return (
    <div className="scene-container">
      {letters.map((letter, index) => (
        <div 
          key={letter} 
          className={`dice-container ${isLoaded ? 'slide-down' : ''} ${isLeaving ? 'slide-up' : ''} dice-${index}`}
          style={{
            position: 'absolute',
            width: '20%',
            height: '20%',
            backgroundColor: 'transparent',
            ...positions[index],
            transform: isLoaded ? 'none' : initialTransforms[index]
          }}
        >
          <DiceCanvas 
            letter={letter} 
            rotationSpeed={rotationSpeeds[index]} 
          />
        </div>
      ))}
      {welcomeMessage1 && (
        <div style={{userSelect : 'none'}} className={`welcome-message-1 ${showWelcomeMessage1 ? 'fade-in' : 'fade-out'}`}>
          {welcomeMessage1}
        </div>
      )}
      {welcomeMessage2 && (
        <div style={{userSelect : 'none'}} className={`welcome-message-2 ${showWelcomeMessage2 ? 'fade-in' : 'fade-out'}`}>
          {welcomeMessage2}
        </div>
      )}
      <div style={{userSelect : 'none'}} className={`title-container ${isLoaded ? 'fade-in' : ''} ${isLeaving ? 'fade-out' : ''}`}>
        {startTyping ? (
          <TypeAnimation
            sequence={[
              'LinguaGen',
              1000,
              'Study English',
              1000,
              'AI-Powered',
              1000,
              'LinguaGen',
            ]}
            wrapper="h3"
            speed={35}
            style={{ fontSize: '100px', marginBottom: '25px', fontFamily: 'InterBold'}}
            repeat={Infinity}
          />
        ) : (
          <h3 style={{ fontSize: '100px', fontWeight: 'bold', marginBottom: '25px', visibility: 'hidden' }}>
            LinguaGen
          </h3>
        )}
        <button onClick={handleStartClick} style={{ opacity: isLeaving ? 0 : 1, transition: 'opacity 0.5s ease-out', width: '200px', marginBottom: '10px' }}>
          시작하기
        </button>
        <br/>
        <button onClick={handleLoginClick} style={{ backgroundColor: 'black', opacity: isLeaving ? 0 : 1, transition: 'opacity 0.5s ease-out', width: '150px',fontSize : '20px', marginTop: '10px' }}>
          로그인하기
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
