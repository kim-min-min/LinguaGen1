import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function MockAdComponent({ onClose, onAdComplete }) {
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const TOTAL_TIME = 30; // 30초

  useEffect(() => {
    let timer;
    if (isWatching) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= TOTAL_TIME) {
            clearInterval(timer);
            setIsWatching(false);
            onAdComplete();
            return TOTAL_TIME;
          }
          return prev + 1;
        });

        // 5초 후에 스킵 버튼 활성화
        if (progress === 5) {
          setCanSkip(true);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isWatching, progress, onAdComplete]);

  const startAd = () => {
    setIsWatching(true);
    setProgress(0);
    setCanSkip(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 h-1/2 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {!isWatching ? (
          <div className="text-center w-full h-full">
            <h2 className="text-2xl font-bold mb-4 jua-regular">광고 시청</h2>
            <p className="text-gray-600 mb-6">
              30초 광고를 시청하고 피로도 20%를 회복하세요!
            </p>
            <div className='w-full h-full flex justify-center items-center'>
            <Button 
              onClick={startAd}
              className="w-1/4 h-[65px] bg-blue-500 hover:bg-blue-600"
            >
              광고 시청 시작
            </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-80 h-48 bg-gray-200 mb-4 mx-auto flex items-center justify-center w-full ">
              <p className="text-gray-500">광고 재생 중...</p>
            </div>
            
            <div className="mb-4 w-full flex flex-col justify-center items-center">
              <Progress 
                value={(progress / TOTAL_TIME) * 100} 
                className="h-2 w-1/3"
              />
              <p className="mt-2 text-sm text-gray-600">
                {TOTAL_TIME - progress}초 남음
              </p>
            </div>

            {canSkip && (
            <div className='w-full flex justify-center items-center'>
              <Button 
                variant="outline" 
                onClick={onAdComplete}
                className="w-1/3 h-[65px]"
              >
                광고 건너뛰기
              </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MockAdComponent; 