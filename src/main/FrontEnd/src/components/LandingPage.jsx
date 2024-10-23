import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import DiceCanvas from './DiceCanvas';
import '../App.css';
import useStore from '../store/useStore';
import DungeonCanvas from './Game/DungeonCanvas';
import RuinsCanvas from './Game/RuinsCanvas';
import MountainCanvas from './Game/MountainCanvas';
import PageLoader from './PageLoader';

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
  const [isLoaderReady, setIsLoaderReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const pageLoaderRef = useRef(null);

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

  const preloadResources = useCallback(async () => {
    // 이미지와 폰트를 미리 로드
    const imageModules = import.meta.glob('../assets/CanvasImage/run_*.png');
    const loadedFrames = await Promise.all(
      Object.values(imageModules).map(importFunc => importFunc())
    );
    const sortedFrames = loadedFrames.map(module => module.default).sort();

    await Promise.all(
      sortedFrames.map(src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      }))
    );

    const font = new FontFace('AntiquityPrint', 'url(src/assets/CanvasImage/font/Antiquity-print.ttf)');
    await font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.error('폰트 로딩 실패:', error);
    });

    setIsLoaderReady(true);
  }, []);

  useEffect(() => {
    preloadResources();
  }, [preloadResources]);

  const selectRandomCanvas = useCallback(() => {
    const randomCanvas = canvases[Math.floor(Math.random() * canvases.length)];
    setSelectedCanvas(() => randomCanvas);
  }, []);

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
          setTimeout(() => {
            selectRandomCanvas(); // PageLoader가 시작될 때 Canvas 선택
            setShowLoader(true); // PageLoader를 표시
          }, 1000);
        }, 3000);
      }, 1000);
    }, 3000);
  }, [setWelcomeMessage1, setShowWelcomeMessage1, setWelcomeMessage2, setShowWelcomeMessage2, setShowLoader, selectRandomCanvas]);

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

  const handleLoadComplete = useCallback(() => {
    setShowLoader(false);
    setShowDemo(true); // PageLoader가 완료된 후 SelectedCanvas를 화면에 표시
  }, [setShowDemo]);

  if (showLoader && isLoaderReady) {
    const SelectedCanvas = selectedCanvas;
    return (
      <>
        <PageLoader ref={pageLoaderRef} onLoadComplete={handleLoadComplete} />
        {selectedCanvas && (
          <div style={{ display: 'none' }}>
            <SelectedCanvas />
          </div>
        )}
      </>
    );
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
