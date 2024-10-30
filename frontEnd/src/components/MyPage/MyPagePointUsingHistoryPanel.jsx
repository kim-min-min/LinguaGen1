import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.jsx";

const MyPagePointUsingHistoryPanel = () => {
  // 데이터를 배열로 준비
  const data = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    points: `${Math.floor(Math.random() * 100)}pt`,
    description: i % 2 === 0 ? '단체방 생성' : '개인방 생성',
    date: `2024 / 10 / ${16 - (i % 15)}`, // 임의의 날짜
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14; // 한 페이지에 표시할 항목 수

  // 현재 페이지에 해당하는 데이터만 가져오기
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page); // 페이지 변경
  };

  return (
    <>
      <div className="pb-10 w-full text-center font-bold text-xl px-4">
        <p>포인트 내역</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>사용 포인트</TableHead>
            <TableHead>내용</TableHead>
            <TableHead className="text-right">날짜</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.points}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="mt-12">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default MyPagePointUsingHistoryPanel;
