import React, { useEffect, useRef, useState } from 'react';

const PageLoader = ({ onLoadComplete }) => {
  const canvasRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const currentFrameRef = useRef(0);
  const animationRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const importImages = async () => {
      console.log('Importing images...');
      const imageModules = import.meta.glob('../assets/CanvasImage/run_*.png');
      console.log('Image modules:', imageModules);
      const loadedFrames = await Promise.all(
        Object.values(imageModules).map(importFunc => importFunc())
      );
      console.log('Loaded frames:', loadedFrames);
      const sortedFrames = loadedFrames.map(module => module.default).sort();
      console.log('Sorted frames:', sortedFrames);
      
      const preloadedFrames = await Promise.all(
        sortedFrames.map(src => new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        }))
      );
      
      setFrames(preloadedFrames);
    };

    importImages();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log('Canvas size:', canvas.width, 'x', canvas.height);

    const frameInterval = 100;
    const totalLoadingTime = 3000; // 총 로딩 시간 (ms)
    const startTime = Date.now();

    const animate = (currentTime) => {
      if (currentTime - lastFrameTimeRef.current > frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 배경색을 하얀색으로 설정
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (frames.length > 0) {
          const img = frames[currentFrameRef.current];
          const scale = 5;
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (canvas.width - scaledWidth) / 2;
          const y = (canvas.height - scaledHeight) / 2;
          

          // 그림자 그리기
          ctx.beginPath();
          ctx.ellipse(canvas.width / 2, y + scaledHeight - 20, scaledWidth / 3, 20, 0, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fill();

          // 이미지 그리기
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        }

        // 로딩 진행도 계산
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(Math.floor((elapsedTime / totalLoadingTime) * 100), 100);
        setLoadingProgress(progress);

        // 로딩 진행도 표시
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const progressText = `${progress}%`;
        const progressX = canvas.width / 2;
        const progressY = canvas.height / 3 + 100;

        ctx.fillText(progressText, progressX, progressY);

        // "로딩중입니다..." 텍스트 표시
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        
        const text = "로딩중입니다...";
        const textX = canvas.width / 2;
        const textY = canvas.height / 3 + 150;

        ctx.strokeText(text, textX, textY);
        ctx.fillText(text, textX, textY);

        if (frames.length > 0) {
          currentFrameRef.current = (currentFrameRef.current + 1) % frames.length;
        }
        lastFrameTimeRef.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // 로딩 완료 처리
    const loadingTimeout = setTimeout(() => {
      onLoadComplete();
    }, totalLoadingTime);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(loadingTimeout);
    };
  }, [frames, onLoadComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
      }}
    />
  );
};

export default PageLoader;
