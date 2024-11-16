import React, { useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";

const MyPageInquiryHistoryPanel = ({ activePanel, setActivePanel }) => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false); // 상태 추가
  const [showInquiryForm, setShowInquiryForm] = useState(false); // 문의 등록 폼 표시 상태
  const [inquiryList, setInquiryList] = useState([
    {
      id: 1,
      title: '랭킹 사이트에 버그가 있는거 같은데요?',
      content: '한국 소설의 기원은 패관 문학이다...',
      date: '2024-10-16',
      answered: 'No',
    },
    {
      id: 2,
      title: '사이트 전체적으로 이쁜거 같아요 혹시 채용도 하시나요?',
      content: '하지만 당대에는 문맹률이 어마어마하게 높았고...',
      date: '2024-10-11',
      answered: 'Yes',
    },
  ]);

  const handleRowClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowAnswer(false); // 선택할 때마다 상태 초기화
  };

  const handleCheckClick = () => {
    if (selectedInquiry.answered === 'Yes') {
      setShowAnswer((prev) => !prev); // 체크 이미지 클릭 시 상태 변경
    }
  };

  const handleInquirySubmit = (newInquiry) => {
    setInquiryList((prevList) => [
      ...prevList,
      { ...newInquiry, id: prevList.length + 1, date: new Date().toISOString().split('T')[0], answered: 'No' },
    ]);
    setShowInquiryForm(false); // 문의 등록 후 폼 숨김
  };

  return (
    <>
      {selectedInquiry ? (
        // 상세 내역 컴포넌트 렌더링
        <MyPageInquiryDetails
          inquiry={selectedInquiry}
          setSelectedInquiry={setSelectedInquiry}
          showAnswer={showAnswer}
          handleCheckClick={handleCheckClick}
        />
      ) : showInquiryForm ? (
        // 문의 등록 폼 렌더링
        <MyPageInquiryRegistering onSubmit={handleInquirySubmit} setShowInquiryForm={setShowInquiryForm} />
      ) : (
        // 문의글 목록 렌더링
        <>
          <div className="pb-10 w-full text-center font-bold text-xl">
            <p>문의글 내역</p>
          </div>
          <div className="flex flex-col items-center justify-start w-full h-full mt-4">
            <div className="w-full h-full mb-32">
              <Table>
                <TableCaption>문의한 내역입니다.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">No</TableHead>
                    <TableHead>답장여부</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead className="text-right">작성일자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiryList.map((inquiry) => (
                    <TableRow key={inquiry.id} onClick={() => handleRowClick(inquiry)}>
                      <TableCell className="font-medium">{inquiry.id}</TableCell>
                      <TableCell>{inquiry.answered}</TableCell>
                      <TableCell>{inquiry.title}</TableCell>
                      <TableCell className="text-right">{inquiry.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="w-full flex justify-end mr-4">
                <Button
                  className="transition ease-in-out delay-100 bg-green-500 hover:-translate-y-1 hover:scale-110 hover:bg-emerald-400 duration-300"
                  onClick={() => setShowInquiryForm(true)}
                >
                  문의하기
                </Button>
              </div>
            </div>
          </div>

        </>
      )}
    </>
  );
};

const MyPageInquiryDetails = ({ inquiry, setSelectedInquiry, showAnswer, handleCheckClick }) => {
  return (
    <Card className="w-full h-auto transition-all duration-500">
      <CardHeader className="font-bold text-xl border-b-2">
        <CardTitle>{inquiry.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row justify-between items-start">
        <div className="flex justify-start items-start text-lg font-medium w-full m-14 mb-0 mr-8 shadow-inner">
          <p className="break-words">
            {inquiry.content}
          </p>
        </div>
        <div className="w-24 h-96 flex justify-center items-center mt-8">
          <img
            src={inquiry.answered === 'Yes' ? 'src/assets/imgs/check.png' : 'src/assets/imgs/unchecked.png'}
            alt=""
            className="w-8 h-8 cursor-pointer"
            onClick={handleCheckClick} // 체크 이미지 클릭 시 이벤트
          />
        </div>
      </CardContent>
      {inquiry.answered === 'Yes' && (
        <div
          className={`overflow-hidden transition-max-height duration-500 ease-in-out ${showAnswer ? 'max-h-96' : 'max-h-0'
            }`}
        >
          <div className="p-6 bg-gray-100">
            <h2 className="font-bold text-lg">답변:</h2>
            <p>
              해당 문제는 이미 해결되었으며, 랭킹 시스템이 업데이트되어 반영이 지연된 상태였습니다.
              확인해 주셔서 감사합니다!
            </p>
          </div>
        </div>
      )}
      <CardFooter>
        <button className="mt-8" onClick={() => setSelectedInquiry(null)}>뒤로가기</button>
      </CardFooter>
    </Card>
  );
};

const MyPageInquiryRegistering = ({ onSubmit, setShowInquiryForm }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      onSubmit({ title, content });
    }
  };

  return (
    <Card className="w-full h-auto transition-all duration-500">
      <CardHeader className="font-bold text-xl border-b-2">
        <CardTitle>새 문의 등록</CardTitle>
      </CardHeader>
      <CardContent className='mt-4'>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="문의 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <textarea
            placeholder="문의 내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded-md"
            rows="6"
            required
          />
          <Button type="submit" className="bg-blue-500 text-white">등록하기</Button>
          <Button type="button" className="bg-gray-400 text-white" onClick={() => setShowInquiryForm(false)}>취소</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MyPageInquiryHistoryPanel;
