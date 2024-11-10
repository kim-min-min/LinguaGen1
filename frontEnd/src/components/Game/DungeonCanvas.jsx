import React, { useRef, useEffect, useState, useCallback } from 'react';
import DungeonImage from '@/assets/CanvasImage/Dungeon.jpg';
import HP_Full from '@/assets/CanvasImage/HP_Full.png';
import HP_Empty from '@/assets/CanvasImage/HP_Empty.png';
import SoundOn from '@/assets/CanvasImage/sound_on.png';
import SoundOff from '@/assets/CanvasImage/sound_off.png';
import GameProgressPage from '@/components/Game/GameProgressPage.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// 스프라이트 이미지를 동적으로 임포트하고 정렬하는 함수
const importAll = (r) => {
  return Object.values(r)
    .map(module => ({ path: module.default, number: parseInt(module.default.match(/\d+/)[0]) }))
    .sort((a, b) => a.number - b.number)
    .map(item => item.path);
};

// 각 애니메이션 타입별로 스프라이트 이미지 임포트
const bossAttackSprites = importAll(import.meta.glob('../../assets/CanvasImage/demon_cleave_*.png', { eager: true }));
const bossIdleSprites = importAll(import.meta.glob('../../assets/CanvasImage/demon_idle_*.png', { eager: true }));
const bossTakeHitSprites = importAll(import.meta.glob('../../assets/CanvasImage/demon_take_hit_*.png', { eager: true }));
const bossDeathSprites = importAll(import.meta.glob('../../assets/CanvasImage/demon_death_*.png', { eager: true }));

// 기사 스프라이트 이미지 임포트
const knightIdleSprites = importAll(import.meta.glob('../../assets/CanvasImage/knight_idle_*.png', { eager: true }));
const knightAttackSprites = importAll(import.meta.glob('../../assets/CanvasImage/knight_atk_*.png', { eager: true }));
const knightTakeHitSprites = importAll(import.meta.glob('../../assets/CanvasImage/knight_take_hit_*.png', { eager: true }));
const knightDeathSprites = importAll(import.meta.glob('../../assets/CanvasImage/knight_death_*.png', { eager: true }));
const knightSpAttackSprites = importAll(import.meta.glob('../../assets/CanvasImage/knight_sp_atk_*.png', { eager: true }));

const DungeonCanvas = () => {
  const canvasRef = useRef(null);
  const [bossState, setBossState] = useState('idle');
  const [knightState, setKnightState] = useState('idle');
  const [bossFrameIndex, setBossFrameIndex] = useState(0);
  const [knightFrameIndex, setKnightFrameIndex] = useState(0);
  const animationRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const [bossHP, setBossHP] = useState(10);
  const [knightHP, setKnightHP] = useState(5);
  const fontLoadedRef = useRef(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 10;
  const [isExitHovered, setIsExitHovered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameClear, setIsGameClear] = useState(false);
  const [gameOverOpacity, setGameOverOpacity] = useState(0);
  const [gameClearOpacity, setGameClearOpacity] = useState(0);
  const fadeIntervalRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isSoundHovered, setIsSoundHovered] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const navigate = useNavigate();


  // 이미지 로드 함수 추가
  const loadImages = useCallback((sprites) => {
    return sprites.map(path => {
      const img = new Image();
      img.src = path;
      return img;
    });
  }, []);

  // 이미지 캐싱
  const bossIdleImages = useRef(loadImages(bossIdleSprites));
  const bossAttackImages = useRef(loadImages(bossAttackSprites));
  const bossTakeHitImages = useRef(loadImages(bossTakeHitSprites));
  const bossDeathImages = useRef(loadImages(bossDeathSprites));
  const knightIdleImages = useRef(loadImages(knightIdleSprites));
  const knightAttackImages = useRef(loadImages(knightAttackSprites));
  const knightTakeHitImages = useRef(loadImages(knightTakeHitSprites));
  const knightDeathImages = useRef(loadImages(knightDeathSprites));
  const knightSpAttackImages = useRef(loadImages(knightSpAttackSprites));
  const hpFullImage = useRef(loadImages([HP_Full])[0]);
  const hpEmptyImage = useRef(loadImages([HP_Empty])[0]);
  const soundOnImage = useRef(loadImages([SoundOn])[0]);
  const soundOffImage = useRef(loadImages([SoundOff])[0]);

  // 배경 이미지 캐싱
  const backgroundRef = useRef(new Image());
  backgroundRef.current.src = DungeonImage;

  const drawHealthBar = useCallback((ctx, x, y, hp, isPlayer = true) => {
    const maxHP = isPlayer ? 5 : 10;
    const spacing = 32;
    
    for (let i = 0; i < maxHP; i++) {
        const image = i < hp ? hpFullImage.current : hpEmptyImage.current;
        if (image && image.complete) {
            ctx.drawImage(image, x + (i * spacing), y, 30, 30);
        }
    }
}, []);

  const animate = useCallback((time) => {
    const frameSpeed = 100; // 프레임 속도 (ms)
    if (time - lastFrameTimeRef.current > frameSpeed) {
      lastFrameTimeRef.current = time;
      setBossFrameIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        const maxFrames = {
          idle: bossIdleSprites.length,
          attack: bossAttackSprites.length,
          takeHit: bossTakeHitSprites.length,
          death: bossDeathSprites.length
        }[bossState];

        if (nextIndex >= maxFrames) {
          if (bossState !== 'idle' && bossState !== 'death') {
            setBossState('idle');
            return 0;
          }
          if (bossState === 'death') {
            return maxFrames - 1; // 죽음 애니메이션의 마지막 프레임에서 멈춤
          }
        }
        return nextIndex % maxFrames;
      });

      setKnightFrameIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        const maxFrames = {
          idle: knightIdleSprites.length,
          attack: knightAttackSprites.length,
          takeHit: knightTakeHitSprites.length,
          death: knightDeathSprites.length,
          spAttack: knightSpAttackSprites.length
        }[knightState];

        if (nextIndex >= maxFrames) {
          if (knightState !== 'idle' && knightState !== 'death') {
            setKnightState('idle');
            return 0;
          }
          if (knightState === 'death') {
            return maxFrames - 1; // 죽음 애니메이션의 마지막 프레임에서 멈춤
          }
        }
        return nextIndex % maxFrames;
      });
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 그리기
    if (backgroundRef.current.complete) {
      ctx.drawImage(backgroundRef.current, 0, 0, canvas.width, canvas.height);
    }

    // 보스 스프라이트 그리기
    const bossImages = {
      idle: bossIdleImages.current,
      attack: bossAttackImages.current,
      takeHit: bossTakeHitImages.current,
      death: bossDeathImages.current
    }[bossState];

    const bossImage = bossImages[bossFrameIndex];
    if (bossImage && bossImage.complete) {
      const bossScale = 2; // 보스 크기 증가
      const bossWidth = (bossImage.width + 100) * bossScale;
      const bossHeight = bossImage.height * bossScale;
      ctx.drawImage(
        bossImage,
        canvas.width / 2.5, // 보스를 오른쪽으로 이동
        canvas.height - bossHeight,
        bossWidth,
        bossHeight
      );
    }

    // 기사 스프라이트 그리기
    const knightImages = {
      idle: knightIdleImages.current,
      attack: knightAttackImages.current,
      takeHit: knightTakeHitImages.current,
      death: knightDeathImages.current,
      spAttack: knightSpAttackImages.current
    }[knightState];
    const knightImage = knightImages[knightFrameIndex];
    if (knightImage && knightImage.complete) {
      const knightScale = 2; // 기사 크기 증가
      const knightWidth = (knightImage.width + 100) * knightScale;
      const knightHeight = knightImage.height * knightScale;
      ctx.drawImage(
        knightImage,
        canvas.width / 1.5 - knightWidth - 90, // 기사를 왼쪽으로 이동
        canvas.height - knightHeight,
        knightWidth,
        knightHeight
      );
    }

    // 체력 바 그리기
    drawHealthBar(ctx, 10, 10, knightHP, true); // 기사 체력 바 (왼쪽)
    drawHealthBar(ctx, canvas.width - 320, 10, bossHP, false); // 보스 체력 바 (오른쪽) - 위치 조정

    // 텍스트 그리기
    if (fontLoadedRef.current) {
      ctx.font = '30px AntiquityPrint';
      ctx.fillStyle = 'green';
      ctx.textAlign = 'center';
      ctx.fillText('LinguaGen', canvas.width / 2, 50);

      ctx.font = '24px AntiquityPrint';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentQuestion}/${totalQuestions}`, canvas.width / 7, 30);

      ctx.font = '24px AntiquityPrint';
      ctx.textAlign = 'center';
      ctx.fillStyle = isExitHovered ? 'green' : 'white';
      ctx.fillText('Exit', canvas.width / 30, 85);

      // GameOver 텍스트 그리기
      if (isGameOver) {
        ctx.font = '48px AntiquityPrint';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(255, 0, 0, ${gameOverOpacity})`;
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 1.7);
      }

      // GameClear 텍스트 그리기
      if (isGameClear) {
        ctx.font = '48px AntiquityPrint';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(0, 255, 0, ${gameClearOpacity})`;
        ctx.fillText('Game Clear', canvas.width / 2, canvas.height / 1.7);
      }
      const soundImage = isSoundOn ? soundOnImage.current : soundOffImage.current;
      if (soundImage && soundImage.complete) {
        const iconSize = 30; // 아이콘 크기
        const iconX = canvas.width / 30 - iconSize / 2;
        const iconY = 115;
        
        // 마우스 호버 효과
        if (isSoundHovered) {
          ctx.globalAlpha = 0.7;
        }
        
        // 사운드 아이콘 그리기
        ctx.drawImage(soundImage, iconX, iconY, iconSize, iconSize);
        ctx.globalAlpha = 1.0;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [bossState, bossFrameIndex, knightState, knightFrameIndex, bossHP, knightHP, drawHealthBar, currentQuestion, isExitHovered, isGameOver, gameOverOpacity, isGameClear, gameClearOpacity,isSoundOn,isSoundHovered]);

  const handleMouseMove = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Exit 텍스트 영역 (좌상단)
    const exitX = canvas.width / 30;
    const exitY = 85;
    const exitWidth = 40;
    const exitHeight = 30;
    
    // Sound 아이콘 영역
    const iconSize = 30;
    const soundX = canvas.width / 30 - iconSize / 2;
    const soundY = 115;

    // Exit 영역 체크 (텍스트 주변 영역을 약간 아래로)
    setIsExitHovered(
      x >= exitX - exitWidth/2 && 
      x <= exitX + exitWidth/2 && 
      y >= exitY - exitHeight/2 + 30 &&
      y <= exitY + exitHeight/2 + 30
    );
    
    // Sound 아이콘 영역 체크 (영역을 약간 아래로)
    setIsSoundHovered(
      x >= soundX && 
      x <= soundX + iconSize && 
      y >= soundY + 75 &&
      y <= soundY + iconSize + 75
    );
  }, []);

  const handleExitClick = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const exitX = canvas.width / 30;
    const exitY = 85;
    const exitWidth = 40;
    const exitHeight = 30;

    // Exit 영역 클릭 감지
    if (
      x >= exitX - exitWidth/2 && 
      x <= exitX + exitWidth/2 && 
      y >= exitY - exitHeight/2 + 30 &&
      y <= exitY + exitHeight/2 + 30
    ) {
      setShowExitDialog(true);
    }
  }, []);

  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Sound 아이콘 클릭 처리
    const iconSize = 30;
    const soundX = canvas.width / 30 - iconSize / 2;
    const soundY = 115;

    if (
      x >= soundX && 
      x <= soundX + iconSize && 
      y >= soundY + 75 &&
      y <= soundY + iconSize + 75
    ) {
      setIsSoundOn(prev => !prev);
    }

    // Exit 클릭 처리
    handleExitClick(event);  // 이벤트 객체를 전달
  }, [handleExitClick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight * 0.6;

    // 폰트 로딩
    if (!fontLoadedRef.current) {
      const font = new FontFace('AntiquityPrint', 'url(/assets/CanvasImage/font/Antiquity-print.ttf)');
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        fontLoadedRef.current = true;
      }).catch((error) => {
        console.error('폰트 로딩 실패:', error);
      });
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      if (fadeIntervalRef.current) {
        cancelAnimationFrame(fadeIntervalRef.current);
      }
    };
  }, [animate, handleMouseMove, handleCanvasClick]);

  useEffect(() => {
    if (isGameOver || isGameClear) {
      let opacity = 0;
      const fadeIn = () => {
        opacity += 1;
        if (opacity <= 1) {
          if (isGameOver) setGameOverOpacity(opacity);
          if (isGameClear) setGameClearOpacity(opacity);
          fadeIntervalRef.current = requestAnimationFrame(fadeIn);
        }
      };

      fadeIn();
    }

    return () => {
      if (fadeIntervalRef.current) {
        cancelAnimationFrame(fadeIntervalRef.current);
      }
    };
  }, [isGameOver, isGameClear]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 100); // 컴포넌트가 마운트된 직후에 opacity를 1로 설정

    return () => clearTimeout(timer);
  }, []);

  const handleBossAttack = useCallback(() => {
    if (bossState === 'idle' && knightHP > 0) {
      setBossState('attack');
      setBossFrameIndex(0);
      setTimeout(() => {
        setKnightState('takeHit');
        setKnightFrameIndex(0);
        setKnightHP(prev => {
          const newHP = Math.max(0, prev - 1);
          if (newHP === 0) {
            setKnightState('death');
            setKnightFrameIndex(0);
            setIsGameOver(true);
            console.log('Game Over set to true'); // 디버깅용 로그 추가
          }
          return newHP;
        });
      }, 1000);
    }
  }, [bossState, knightHP]);

  const handleKnightAttack = useCallback(() => {
    if (knightState === 'idle' && bossHP > 0) {
      if (bossHP === 1) {
        setKnightState('spAttack');
      } else {
        setKnightState('attack');
      }
      setKnightFrameIndex(0);
      setTimeout(() => {
        setBossState('takeHit');
        setBossFrameIndex(0);
        setBossHP(prev => {
          const newHP = Math.max(0, prev - 1);
          if (newHP === 0) {
            setTimeout(() => {
              setBossState('death');
              setBossFrameIndex(0);
              setIsGameClear(true);  // 보스가 죽으면 Game Clear
            }, 1000);
          }
          return newHP;
        });
      }, 1000);
    }
  }, [knightState, bossHP]);

  const incrementQuestion = useCallback(() => {
    setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions));
  }, [totalQuestions]);

  const handleCorrectAnswer = useCallback(() => {
    handleKnightAttack();
    incrementQuestion();
  }, [handleKnightAttack, incrementQuestion]);

  const handleWrongAnswer = useCallback(() => {
    handleBossAttack();
    incrementQuestion();
  }, [handleBossAttack, incrementQuestion]);

  const handleRestart = useCallback(() => {
    setIsGameOver(false);
    setIsGameClear(false);
    setKnightHP(5);
    setBossHP(10);
    setKnightState('idle');
    setBossState('idle');
    setCurrentQuestion(1);
    setGameOverOpacity(0);
    setGameClearOpacity(0);
  }, []);

  const handleMainMenu = useCallback(() => {
    // 메인 메뉴로 이동하는 로직
    // 예: 라우터를 사용한다면 history.push('/main') 등
    console.log('메인 메뉴로 이동');
  }, []);

  return (
    <>
    <div
      style={{
        width: '100%',
        height: '100%',
        opacity: opacity,
        transition: 'opacity 1s ease-in',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', height: '60vh' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ height: '40vh' }}>
        {!isGameOver && !isGameClear && (
          <GameProgressPage
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
          />
        )}
        {(isGameOver || isGameClear) && (
          <GameProgressPage
            isGameOver={isGameOver}
            isGameClear={isGameClear}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}
      </div>
    </div>
    {/* Exit 다이얼로그 */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4"
          >
            <h3 className="text-xl font-bold text-center mb-4">
              메인 메뉴로 돌아가시겠습니까?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/main')}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowExitDialog(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                No
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DungeonCanvas;
