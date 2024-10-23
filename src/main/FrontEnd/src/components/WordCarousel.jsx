import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const WordCarousel = () => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8085/api/words')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Data:', data); // 데이터 구조 확인
                setWords(data);
            })
            .catch(error => console.error('Error fetching words:', error));
    }, []);

    return (
        <div className='flex flex-col items-center gap-4'>
            <p style={{fontSize: '24px', fontWeight: 'bold', color: '#f0fdfa'}}>오늘의 단어</p>
            {words.length === 0 ? (
                <p>단어를 불러오는 중...</p>  // 데이터가 없을 때 표시
            ) : (
                <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                        {words.map((word, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                                            <h2 className="text-4xl InterBold mb-2" style={{ userSelect: 'none' }}>
                                                {word.word}
                                            </h2>
                                            <h4 className="text-2xl text-gray-600" style={{ userSelect: 'none' }}>
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
            )}
        </div>
    );
};

export default WordCarousel;
