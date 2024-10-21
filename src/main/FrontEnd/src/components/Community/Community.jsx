import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '../Header'; // Assuming Header is already imported
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome CSS 추가
import '../../App.css';
import Notice from './Notice'; // 공지사항 컴포넌트 임포트
import FreeBoard from './FreeBoard'; // 자유게시판 컴포넌트 임포트
import ExchangeLearningTips from './ExchangeLearningTips'; // 학습 팁 교환 컴포넌트 임포트
import ClubBoard from './ClubBoard'; // 동아리 게시판 컴포넌트 임포트
import { Link } from 'react-router-dom';
import Writing from './Writing';
import DetailView from './DetailView';

const SearchBox = styled.div`
  margin-top : 15px;
  width: fit-content;  // fit-content로 크기 자동 조절
  height: fit-content;
  position: relative;  // 부모 요소에 position: relative 추가
`;

const SearchInput = styled.input`
  height: 50px;
  width: 50px;
  border-style: none;
  padding: 10px;
  font-size: 18px;
  letter-spacing: 2px;
  outline: none;
  border-radius: 25px;
  transition: all 0.5s ease-in-out;
  background-color: #22a6b3;
  padding-right: 40px;
  color: #fff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-size: 18px;
    letter-spacing: 2px;
    font-weight: 100;
  }

  &:focus {
    width: 200px;
    border-radius: 22px;
    background-color: #22a6b3;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 500ms cubic-bezier(0, 0.110, 0.35, 2);
  }
`;

const SearchButton = styled.button`
  width: 58px;
  height: 32px;
  border-style: none;
  font-size: 20px;
  font-weight: bold;
  outline: none;
  cursor: pointer;
  border-radius: 50%;
  position: absolute;
  top: 27%; // 버튼을 세로 중앙 정렬
  right: 2px; // 오른쪽 끝에서 간격을 설정
  transform: translateY(-50%); // 세로 중앙 정렬 보정
  color: #ffffff;
  background-color: transparent;
`;

const Item = styled.div`
  display: list-item;
  margin-left : 15px;
  list-style-position: inside;
  padding: 14px;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? '#bbf7d0' : 'black')}; /* 클릭된 상태일 때 색상 변경 */
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ isActive }) => (isActive ? '#bbf7d0' : '#bbf7d0')}; /* hover 상태에서 색상 변경 */
  }
  transition: color 0.3s ease; /* 부드러운 색상 전환 애니메이션 */
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비디오가 화면에 맞도록 커버되도록 설정 */
  z-index: -1; /* 다른 요소 뒤에 배치 */
`;

const boardData = [
  {
    title: '공지사항',
    tabKey: 'Notice', // 탭에 대응하는 키 추가
    posts: [
      { author: '프론트엔드운영자', date: '2024.10.16', views: '4,761', title: '링구아젠에 오신걸 환영합니다', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', title: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', title: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', title: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  },
  {
    title: '자유게시판',
    tabKey: 'FreeBoard', // 탭에 대응하는 키 추가
    posts: [
      { author: '프론트엔드운영자', date: '2024.10.16', views: '4,761', title: '이거 자유게시판 맞냐?', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', title: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', title: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', title: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  },
  {
    title: '학습 팁 교환',
    tabKey: 'ExchangeLearningTips', // 탭에 대응하는 키 추가
    posts: [
      { author: '학습팁운영자', date: '2024.10.16', views: '4,761', title: '링구아젠에 오신걸 환영합니다', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', title: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', title: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', title: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  },
  {
    title: '동아리 게시판',
    tabKey: 'ClubBoard', // 탭에 대응하는 키 추가
    posts: [
      { author: '동아리는 역시 신이다', date: '2024.10.16', views: '4,761', title: '링구아젠에 오신걸 환영합니다', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', title: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', title: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', title: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  }
];

// 기본 게시판 컴포넌트
const DefaultBoard = ({ handleTabClick, setSelectedItem }) => {
  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    setSelectedItem(post); // 선택한 게시글 데이터를 저장
    handleTabClick('DetailView'); // 상세보기 탭으로 이동
  };

  return (
    <div className='w-full p-8 mt-8 bg-white rounded-md grid grid-cols-6 gap-8' style={{ height: '1450px' }}>
      {boardData.map((board, index) => (
        <div className='flex flex-col col-span-3 row-span-3 w-full h-full' key={index}>
          <div className='border-slate-500 border-b-2 flex flex-row justify-between pb-2'>
            <p className='font-bold'>{board.title}</p>
            <p className='text-gray-300 cursor-pointer' onClick={() => handleTabClick(board.tabKey)}>
              더보기 {'>'}
            </p>
          </div>
          {board.posts.slice(0, 4).map((post, idx) => (
            <div
              className='w-full h-42 flex flex-col border-b-2 py-2 items-start cursor-pointer'
              key={idx}
              onClick={() => handlePostClick(post)} // 게시글 클릭 시 상세보기로 이동
            >
              <h3 className='font-bold text-lg'>{post.title}</h3>
              <p className='mt-2 mb-4'>{post.description}</p>
              <p className='cursor-pointer underline md:decoration-1'>{post.author}</p>
              <div className='w-1/2 flex justify-between mt-4 text-sm text-gray-400'>
                <p>{post.date}</p>
                <p>조회 {post.views}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Community = () => {
  const [activeTab, setActiveTab] = useState(''); // 기본 컴포넌트는 ''로 설정
  const inputRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleTabClick = (title) => {
    setActiveTab(title);
  };

  return (
    <div className='w-full h-full flex flex-col overflow-y-scroll custom-scrollbar'>
      <BackgroundVideo autoPlay muted loop>
        <source src='src/assets/video/CommunityBackground.mp4' type='video/mp4' />
      </BackgroundVideo>
      <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
      <div className='w-full flex flex-col justify-center items-center my-12' style={{ height: '350px' }}>
        <Link to='/community' onClick={() => handleTabClick('')}>
          <h1 className='select-none'>Community</h1>
        </Link>
      </div>
      <div className='w-full h-auto flex justify-center items-center'>
        <div className='w-full h-full mt-12 mb-18 flex grid-cols-2 justify-center'>
          <div className='w-1/6 h-96 flex flex-col justify-start items-start m-8 border-2 border-gray-300 rounded-lg' style={{ backdropFilter: 'blur(15px)', background: 'rgba(255, 255, 255, 0.2' }}>
            <div className='col-span-2 w-full h-24 pt-2 pl-4'>
              <SearchBox>
                <SearchInput ref={inputRef} type="text" placeholder="Search..." />
                <SearchButton onClick={() => inputRef.current.focus()}>
                  <i className="fas fa-search"></i>
                </SearchButton>
              </SearchBox>
            </div>
            <div className='w-full h-auto my-8'>
              {/* 탭 항목 클릭 가능하게 설정 */}
              <Item isActive={activeTab === 'Notice'} onClick={() => handleTabClick('Notice')}>
                공지사항
              </Item>
              <Item isActive={activeTab === 'FreeBoard'} onClick={() => handleTabClick('FreeBoard')}>
                자유게시판
              </Item>
              <Item isActive={activeTab === 'ExchangeLearningTips'} onClick={() => handleTabClick('ExchangeLearningTips')}>
                학습 팁 교환
              </Item>
              <Item isActive={activeTab === 'ClubBoard'} onClick={() => handleTabClick('ClubBoard')}>
                동아리 게시판
              </Item>
            </div>
          </div>

          <div className='w-1/2 h-full flex flex-col justify-start items-center'>
            {/* 조건부 렌더링: 선택된 탭에 따라 컴포넌트를 렌더링 */}
            {activeTab === '' && <DefaultBoard handleTabClick={handleTabClick} setSelectedItem={setSelectedItem} />}
            {activeTab === 'Notice' && <Notice handleTabClick={handleTabClick} setSelectedItem={setSelectedItem} />}
            {activeTab === 'FreeBoard' && <FreeBoard handleTabClick={handleTabClick} />}
            {activeTab === 'ExchangeLearningTips' && <ExchangeLearningTips handleTabClick={handleTabClick} />}
            {activeTab === 'ClubBoard' && <ClubBoard handleTabClick={handleTabClick} />}
            {activeTab === 'Writing' && <Writing />} {/* 글쓰기 탭 */}
            {activeTab === 'DetailView' && <DetailView selectedItem={selectedItem} handleTabClick={handleTabClick} />} {/* 상세보기 페이지 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
