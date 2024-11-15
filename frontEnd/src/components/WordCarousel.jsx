import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

// API 호출 함수 분리
const fetchWords = async () => {
    const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/words`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const WordCarousel = () => {
    // React Query로 데이터 fetching
    const { data: words, isLoading, error } = useQuery({
        queryKey: ['words'],
        queryFn: fetchWords,
        staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 'fresh'하다고 간주
        cacheTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
        retry: 2, // 실패시 2번 재시도
    });

    if (isLoading) {
        return (
            <div className='flex flex-col items-center gap-4'>
                <p style={{fontSize: '24px', fontWeight: 'bold', color: '#f0fdfa', userSelect: 'none', marginTop: '68px'}} className='jua-regular'>
                    오늘의 단어
                </p>
                <p className="text-white">단어를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col items-center gap-4'>
                <p style={{fontSize: '24px', fontWeight: 'bold', color: '#f0fdfa', userSelect: 'none', marginTop: '68px'}} className='jua-regular'>
                    오늘의 단어
                </p>
                <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center gap-4'>
            <p style={{fontSize: '24px', fontWeight: 'bold', color: '#f0fdfa', userSelect: 'none', marginTop: '68px'}} className='jua-regular'>
                오늘의 단어
            </p>
            <Carousel className="w-full max-w-xs">
                <CarouselContent>
                    {words?.map((word, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card style={{backdropFilter: 'blur(15px)', background: 'rgba(255, 255, 255, 0.2)'}}>
                                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                                        <h2 className="text-4xl kanit-bold mb-2" style={{ userSelect: 'none' }}>
                                            {word.word}
                                        </h2>
                                        <h4 className="text-2xl text-gray-600 jua-regular" style={{ userSelect: 'none' }}>
                                            {word.wordDesc}
                                        </h4>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hover:bg-transparent focus:outline-none focus:ring-0" />
                <CarouselNext className="hover:bg-transparent focus:outline-none focus:ring-0" />
            </Carousel>
        </div>
    );
};

export default WordCarousel;
