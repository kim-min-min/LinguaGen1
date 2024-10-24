import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

const ExchangeLearningTips = ({ handleTabClick }) => {
  // 카페 게시판 형식의 데이터셋
  const data = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: i % 2 === 0 ? '공지사항: 단체방 생성 안내' : '공지사항: 개인방 생성 안내',
    author: i % 2 === 0 ? '관리자' : '운영팀',
    date: `2024.10.${16 - (i % 15)}`, // 임의의 날짜
    views: Math.floor(Math.random() * 1000), // 조회수
    likes: Math.floor(Math.random() * 100), // 좋아요 수
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // 한 페이지에 표시할 항목 수 (초기값 15)

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page); // 페이지 변경
  };

  // 아이템 개수 변경 핸들러
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value, 10)); // 선택된 값을 숫자로 변환 후 설정
    setCurrentPage(1); // 페이지가 바뀌면 첫 페이지로 돌아감
  };

  return (
    <div className="w-full bg-white rounded-md flex flex-col p-12 justify-start items-center min-h-screen"> {/* min-height 설정 */}
      <p className="font-bold text-xl">학습 팁 공유</p>
      <div className="mt-8 w-full h-full flex flex-col bg-transparent flex-grow"> {/* flex-grow 추가 */}
        <div className="w-full h-20 border-b-2 border-gray-300 flex justify-end items-center gap-4">
          <Button
            className='bg-green-300 text-gray-500 font-bold hover:bg-green-400'
            onClick={() => handleTabClick('Writing')} // 글쓰기 클릭 시 activeTab을 Writing으로 변경
          >
            글쓰기
          </Button>
          <Separator className="h-8" orientation="vertical" />
          <Select onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={`${itemsPerPage}개씩`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5개씩</SelectItem>
              <SelectItem value="10">10개씩</SelectItem>
              <SelectItem value="15">15개씩</SelectItem>
              <SelectItem value="20">20개씩</SelectItem>
              <SelectItem value="30">30개씩</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center"></TableHead>
              <TableHead className="text-center">제목</TableHead>
              <TableHead className="text-center w-[100px]">작성자</TableHead>
              <TableHead className="text-center w-[100px]">작성일</TableHead>
              <TableHead className="text-center w-[100px]">조회수</TableHead>
              <TableHead className="text-right w-[100px]">좋아요</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-center h-14">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell className="text-center">{item.author}</TableCell>
                <TableCell className="text-center">{item.date}</TableCell>
                <TableCell className="text-center">{item.views}</TableCell>
                <TableCell className="text-right">{item.likes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Math.max(currentPage - 1, 1));
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Math.min(currentPage + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ExchangeLearningTips;
