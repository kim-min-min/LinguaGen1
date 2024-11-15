import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import {format} from "date-fns";

const MyPagePointUsingHistoryPanel = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // 한 페이지에 표시할 항목 수

  useEffect(() => {
    const fetchPointHistory = async () => {
      try {
        const userId = sessionStorage.getItem('id'); // 세션 스토리지에서 사용자 ID 가져오기
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/points/history/${userId}`);
        setData(response.data); // 서버에서 받은 데이터를 상태에 설정
      } catch (error) {
        console.error('포인트 내역을 불러오는 중 에러 발생:', error);
      }
    };

    fetchPointHistory();
  }, []);

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
          {selectedData.map((item, index) => (
            <TableRow key={item.idx}>
              <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
              <TableCell>{item.changeAmount}</TableCell>
              <TableCell>{item.changeType}</TableCell>
              <TableCell className="text-right">{format(new Date(item.createdAt), 'yyyy-MM-dd')}</TableCell>
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
