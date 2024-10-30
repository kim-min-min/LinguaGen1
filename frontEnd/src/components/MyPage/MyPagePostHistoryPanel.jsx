import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination.jsx"

import styled from 'styled-components';

const NotepadDiv = styled.div`
  position: relative;
  padding: 2px;
  font-size: 16px;
  line-height: 30px;
  min-height: 90px;
  white-space: pre-wrap;
  background-image: linear-gradient(to bottom, transparent 29px, #ccc 30px);
  background-size: 100% 30px;
`;

const Tooltip = styled.div`
  visibility: hidden;
  max-width: 250px;
  width: 150px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const IconImage = styled.img`
  width: 16px;
  height: 16px;
  
  &:hover + ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

const MyPagePostHistoryPanel = () => {
    const cards = Array.from({ length: 9 }, (_, index) => ({
        id: index + 1,
        title: `게시글 제목 ${index + 1}`,
        content: '같이 영어단어 공부할 여신 구함 근데 공부는 어떻게 할꺼임?',
        commentsCount: 0,
    }));

    const [isHovered, setIsHovered] = useState(null); // 마우스 호버 상태를 저장

    const handleMouseEnter = (id) => {
        setIsHovered(id);
    };

    const handleMouseLeave = () => {
        setIsHovered(null);
    };

    return (
        <>
            <div className='pb-10 w-full text-center font-bold text-xl'>
                <p>게시글 내역</p>
            </div>
            <div className='grid grid-cols-3 gap-4 items-start justify-start w-full mt-4 px-8'>
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        className='h-64 w-full'
                        style={{
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            userSelect: 'none',
                            transform: isHovered === card.id ? 'translateY(-10px)' : 'translateY(0)',
                            boxShadow: isHovered === card.id
                                ? '0px 10px 15px rgba(0, 0, 0, 0.1)'
                                : 'none',
                        }}
                        onMouseEnter={() => handleMouseEnter(card.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <CardHeader className='flex flex-row items-center justify-between border-b-2'>
                            <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className='pt-12'>
                            <NotepadDiv contentEditable={false}>
                                {card.content}
                            </NotepadDiv>
                        </CardContent>
                        <CardFooter style={{ position: 'relative', display: 'inline-block' }}>
                            <IconImage src="src/assets/imgs/comments.png" alt="comments icon" />
                            <Tooltip>댓글 달린 갯수: {card.commentsCount}</Tooltip>
                        </CardFooter>
                    </Card>
                ))}
                <div className='h-24 w-full flex justify-center items-center col-span-3 mb-24' >
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">4</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                </div>
            </div>
        </>
    );
};

export default MyPagePostHistoryPanel;
