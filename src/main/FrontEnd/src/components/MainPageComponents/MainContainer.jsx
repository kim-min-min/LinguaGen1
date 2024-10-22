import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useStore from '../../store/useStore';
import '../../App.css';
import Word3D from '../Word3D';  // Word3D 컴포넌트 임포트

const MainContainer = ({ selectedGame }) => {
  const { cards, loading, loadMoreCards, isLoggedIn } = useStore();
  const containerRef = useRef(null);
  const [overscrollShadow, setOverscrollShadow] = useState(0);

  const handleStartGame = () => {
    console.log(selectedGame);
    
  };

  // 예시 단어 목록 (실제로는 API나 상태에서 가져와야 합니다)
  const wrongWords = [
    { english: 'apple', korean: '사과' },
    { english: 'banana', korean: '바나나' },
    { english: 'cherry', korean: '체리' },
    { english: 'date', korean: '대추' },
    { english: 'elderberry', korean: '엘더베리' },
    { english: 'fig', korean: '무화과' },
  ];

  useEffect(() => {
    loadMoreCards(); // 초기 카드 로드
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isLoggedIn) return; // containerRef가 없거나 로그인하지 않은 경우 리턴

    const handleScroll = () => {
      // 스크롤이 최상단에서 오버스크롤 시 그림자 효과
      if (container.scrollTop <= 0) {
        const overscrollAmount = Math.abs(container.scrollTop);
        setOverscrollShadow(Math.min(overscrollAmount + 10, 100)); // 최대 100px까지 shadow 길이
      } else {
        setOverscrollShadow(0); // 기본 상태로 shadow 길이 설정
      }

      // 무한 스크롤 조건: 스크롤이 하단에 도달했을 때
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50 && !loading) {
        loadMoreCards(); // 추가 카드 로드
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, loadMoreCards, isLoggedIn]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start mx-12 bg-white">
      {isLoggedIn ? (
        // 로그인한 경우의 UI
        <>
          <div className="w-full flex justify-center mb-4 mt-4">
            <Button onClick={handleStartGame} className="w-40 h-14 text-white rounded-md font-bold text-xl hover:scale-125 transition-all duration-500">
              게임 시작하기
            </Button>
          </div>
          {selectedGame && <p>선택된 게임 유형 : {selectedGame}</p>}
          <div
            ref={containerRef}
            className="w-full h-[calc(100vh-200px)] pb-20 overflow-y-auto flex justify-center border-t-2 pt-12 relative custom-scrollbar"
            style={{
              boxShadow: `inset 0 ${overscrollShadow}px ${overscrollShadow}px -${overscrollShadow / 2}px rgba(0, 0, 0, 0.1), inset 0 ${overscrollShadow / 2}px ${overscrollShadow / 2}px -${overscrollShadow / 4}px rgba(0, 0, 0, 0.05)`,
            }}
          >
            <div className="w-1/2 grid grid-cols-1 gap-8 pb-8">
              {cards.map((card, index) => (
                <Card key={index} className="w-full" style={{userSelect : 'none'}}>
                  <CardHeader>
                    <CardTitle>{card.date}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row">
                    <div className="flex flex-col w-1/2 text-center">
                      <p className="mb-2">{card.category}</p>
                      <p className="mb-2">{card.level}</p>
                      <p className="mb-2">{card.score}</p>
                      <p className="mb-2">{card.rank}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="btnAnimation btnPush btnLightBlue w-full h-26 mt-2 p-4 flex items-center justify-center ml-12 rounded-md text-black font-bold"
                          style={{ backgroundColor: '#e3eef1', border: 'none', outline: 'none' }}
                        >
                          틀린 단어 보기
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] h-[600px] overflow-y-auto">
                        <DialogHeader className="h-20">
                          <DialogTitle>틀린 단어 노트</DialogTitle>
                          <DialogDescription>틀린 단어를 확인하세요~</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 mb-16 text-center">
                          {wrongWords.map((word, index) => (
                            <React.Fragment key={index}>
                              <div className="bg-gray-100 p-2 rounded">{word.english}</div>
                              <div className="bg-gray-100 p-2 rounded">{word.korean}</div>
                            </React.Fragment>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
              {loading && (
                <div className="flex justify-center items-center">
                  <div className="loader"></div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // 로그인하지 않은 경우의 UI
        <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <h2 className="text-sm font-bold mb-8 mt-12 text-gray-400">* 로그인을 해야 게임을 할 수 있습니다 *</h2>
          <div className="w-[800px] h-[800px] bg-transparent flex items-center justify-center">
            <Word3D /> {/* Word3D 컴포넌트를 여기에 추가 */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContainer;