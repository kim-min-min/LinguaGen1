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
      const imageModules = import.meta.glob('../assets/CanvasImage/run_*.png');
      const loadedFrames = await Promise.all(
        Object.values(imageModules).map(importFunc => importFunc())
      );
      const sortedFrames = loadedFrames.map(module => module.default).sort();

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

    const frameInterval = 100;
    const totalLoadingTime = 3000; // 총 로딩 시간 3초
    const startTime = performance.now();

    const font = new FontFace('AntiquityPrint', 'url(src/assets/CanvasImage/font/Antiquity-print.ttf)');
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.error('폰트 로딩 실패:', error);
    });

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(Math.floor((elapsedTime / totalLoadingTime) * 100), 100);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (frames.length > 0) {
        const img = frames[currentFrameRef.current];
        const scale = 5;
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, y + scaledHeight - 20, scaledWidth / 3, 20, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      }

      setLoadingProgress(progress);
      
      ctx.font = '24px AntiquityPrint';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const progressText = `${progress}%`;
      const progressX = canvas.width / 2;
      const progressY = canvas.height / 3 + 100;

      ctx.fillText(progressText, progressX, progressY);

      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;

      const text = "로딩중입니다...";
      const textX = canvas.width / 2;
      const textY = canvas.height / 3 + 150;

      ctx.strokeText(text, textX, textY);
      ctx.fillText(text, textX, textY);

      if (frames.length > 0 && currentTime - lastFrameTimeRef.current > frameInterval) {
        currentFrameRef.current = (currentFrameRef.current + 1) % frames.length;
        lastFrameTimeRef.current = currentTime;
      }

      if (progress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onLoadComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
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
