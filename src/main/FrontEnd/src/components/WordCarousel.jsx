import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

// 단어 목록 추가
const words = [
  { english: "Apple", korean: "사과" },
  { english: "Book", korean: "책" },
  { english: "Cat", korean: "고양이" },
  { english: "Dog", korean: "개" },
  { english: "Elephant", korean: "코끼리" },
];

const WordCarousel = () => {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {words.map((word, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                  <h2 className="text-4xl InterBold mb-2" style={{ userSelect: 'none' }}>{word.english}</h2>
                  <h4 className="text-2xl text-gray-600" style={{ userSelect: 'none' }}>{word.korean}</h4>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hover:bg-transparent focus:outline-none focus:ring-0" />
      <CarouselNext className="hover:bg-transparent focus:outline-none focus:ring-0" />
    </Carousel>
  )
}

export default WordCarousel