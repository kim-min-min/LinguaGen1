import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.jsx';
import { Button } from '@/components/ui/button.jsx';
import { format } from 'date-fns';

const Notice = ({ handleTabClick, setSelectedItem }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);  // 서버에서 가져올 공지사항 데이터
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // 한 페이지에 표시할 항목 수 (초기값 15)

// 공지사항 데이터 가져오기
  useEffect(() => {
    fetch('http://localhost:8085/api/community/category/Notice') // 공지사항 데이터를 가져오는 백엔드 API URL
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setData(data);
          } else {
            console.error("API returned data that is not an array:", data);
            setData([]); // 비정상 데이터의 경우 빈 배열로 설정
          }
        })
        .catch(error => console.error('Error fetching notice data:', error));
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page); // 페이지 변경
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value, 10)); // 선택된 값을 숫자로 변환 후 설정
    setCurrentPage(1); // 페이지가 바뀌면 첫 페이지로 돌아감
  };

  const handleWriteClick = () => {
    navigate('/community/notice/writing');
  };

  const handleRowClick = (item) => {
    setSelectedItem(item); // 선택한 데이터를 설정
    handleTabClick('detailview', 'notice'); // 'notice'를 추가로 전달
  };

  return (
    <div className="w-full bg-white rounded-md flex flex-col p-12 justify-start items-center min-h-screen mt-8">
      <p className="font-bold text-xl">공지사항</p>
      <div className="mt-8 w-full h-full flex flex-col bg-transparent flex-grow">
        <div className="w-full h-20 border-b-2 border-gray-300 flex justify-end items-center gap-4">
          <Button
            className='bg-green-300 text-gray-500 font-bold hover:bg-green-400'
            onClick={handleWriteClick}
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
              <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer">
                <TableCell className="font-medium text-center h-14">{item.idx}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell className="text-center">{item.author}</TableCell>
                <TableCell className="text-center">{format(new Date(item.createdAt), 'yyyy-MM-dd')}</TableCell>
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

export default Notice;
