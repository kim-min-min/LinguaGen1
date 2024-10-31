import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Header from '../Header'; // Assuming Header is already imported
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome CSS 추가
import '../../App.css';
import Notice from './Notice'; // 공지사항 컴포넌트 임포트
import FreeBoard from './FreeBoard'; // 자유게시판 컴포넌트 임포트
import ExchangeLearningTips from './ExchangeLearningTips'; // 학습 팁 교환 컴포넌트 임포트
import ClubBoard from './ClubBoard'; // 동아리 게시판 컴포넌트 임포트
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import Writing from './Writing';
import DetailView from './DetailView';
import axios from 'axios';
import {format} from "date-fns";

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
    color: ${({ isActive }) => (isActive ? '#bbf7d0' : '#bbf7d0')}; /* hover 상에 색상 변경 */
  }
  transition: color 0.3s ease; /* 부드러운 색상 전환 애니메이션 */
`;

const BackgroundVideoWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CommunityContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

// 페이드 인 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// 페이드 인 애니메이션을 적용한 컨테이너
const FadeInContainer = styled.div`
  animation: ${fadeIn} 1s ease-in-out;
`;

// 기본 시판 컴포넌트
const DefaultBoard = ({ handleTabClick, setSelectedItem }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [boardData, setBoardData] = useState({
    Notice: [],
    FreeBoard: [],
    ExchangeLearningTips: [],
    ClubBoard: []
  });

  const [loading, setLoading] = useState(true);

// 각 게시판의 최신 글 4개 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responses = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/community/latest/Notice`),
          axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/community/latest/FreeBoard`),
          axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/community/latest/ExchangeLearningTips`),
          axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/community/latest/ClubBoard`)
        ]);

        // 각 카테고리의 데이터를 상태로 업데이트
        setBoardData({
          Notice: responses[0].data,
          FreeBoard: responses[1].data,
          ExchangeLearningTips: responses[2].data,
          ClubBoard: responses[3].data
        });
        setLoading(false); // 모든 데이터 로딩이 완료되면 로딩 상태 해제
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false); // 에러가 발생해도 로딩을 해제
      }
    };
    fetchPosts();
  }, []); // 빈 배열을 존성으로 설정해 첫 렌더링 시 한 번만 실행

  if (loading) {
    return <div className="custom-loader"></div>; // 로딩 중일 때 보여줄 UI
  }

// 각 게시판에 해당하는 카테고리명과 데이터 연결
  const boardTitles = {
    Notice: '공지사항',
    FreeBoard: '자유게시판',
    ExchangeLearningTips: '학습 팁 교환',
    ClubBoard: '동아리 게시판'
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post, category) => {
    setSelectedItem(post);
    const boardPath = category.toLowerCase();
    navigate(`/community/${boardPath}/detailview/${post.idx}`);
  };

  return (
    <div className='w-full p-8 mt-8 bg-white rounded-md grid grid-cols-6 gap-8' style={{ height: '1450px' }}>
      {Object.keys(boardData).map((category, index) => (
        <div className='flex flex-col col-span-3 row-span-3 w-full h-full' key={index}>
          <div className='border-slate-500 border-b-2 flex flex-row justify-between pb-2'>
            <p className='font-bold'>{boardTitles[category]}</p>
            <p className='text-gray-300 cursor-pointer' onClick={() => handleTabClick(category)}>
              더보기 {'>'}
            </p>
          </div>
          {boardData[category] && boardData[category].slice(0, boardData[category].length).map((post, idx) => (
            <div
              className='w-full h-42 flex flex-col border-b-2 py-2 items-start cursor-pointer'
              key={idx}
              onClick={() => handlePostClick(post, category)} // category 인자 추가
            >
              <h3 className='font-bold text-lg'>{post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}</h3>
              <p className='mt-2 mb-4'> {post.content.length > 30 ? post.content.slice(0, 30) + '...' : post.content}</p>
              <p className='cursor-pointer underline md:decoration-1'>{post.nickname ? post.nickname : post.userId}</p>
              <div className='w-1/2 flex justify-between mt-4 text-sm text-gray-400'>
                <p>{format(new Date(post.createdAt), 'yyyy-MM-dd')}</p>
                <p>조회 {post.viewCount}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Community = () => {
  const { board, idx } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(board || '');
  const [selectedItem, setSelectedItem] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const path = location.pathname.split('/');
    if (path.includes('detailview')) {
      setActiveTab('detailview');
    } else if (path.includes('writing')) {
      setActiveTab('writing');
    } else {
      setActiveTab(board || '');
    }

    // 비디오 재생 유지
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [board, location]);

  const handleTabClick = (title, currentBoard) => {
    if (title === 'detailview') {
      navigate(`/community/${currentBoard}/detailview`);
    } else if (title === 'writing') {
      navigate(`/community/${currentBoard}/writing`);
    } else {
      setActiveTab(title);
      navigate(`/community/${title.toLowerCase()}`);
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    navigate(`/community/${activeTab.toLowerCase()}/detailview`);
  };

  return (
    <FadeInContainer>
      <CommunityContainer className='overflow-y-auto custom-scrollbar'>
        <BackgroundVideoWrapper>
          <BackgroundVideo ref={videoRef} autoPlay muted loop>
            <source src='/src/assets/video/CommunityBackground.mp4' type='video/mp4' />
          </BackgroundVideo>
        </BackgroundVideoWrapper>
        <Header />
        
        {/* 커뮤니티 타이틀 */}
        <div className='w-full flex justify-center items-center mt-8 mb-4'>
          <Link to='/community' onClick={() => handleTabClick('')}>
            <h1 className='select-none kanit-bold'>Community</h1>
          </Link>
        </div>

        {/* 메인 컨텐츠 영역을 grid로 구성 */}
        <main className='w-full h-full grid grid-cols-12 gap-4 p-4 pt-0'>
          {/* 왼쪽 사이드바 */}
          <div className='col-span-3 col-start-2 flex flex-col items-center'>
            <div className='w-80 flex flex-col border-2 border-gray-300 rounded-lg backdrop-blur-md bg-white/20 mt-8'>
              <div className='w-full p-4'>
                <SearchBox>
                  <SearchInput type="text" placeholder="Search..." />
                  <SearchButton>
                    <i className="fas fa-search"></i>
                  </SearchButton>
                </SearchBox>
              </div>
              <div className='w-full my-8 jua-regular text-xl'>
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
          </div>

          {/* 오른쪽 메인 컨테이너 */}
          <div className='col-span-7 flex flex-col'>
            {activeTab === '' && <DefaultBoard handleTabClick={handleTabClick} setSelectedItem={setSelectedItem} />}
            {activeTab === 'notice' && <Notice handleTabClick={handleTabClick} setSelectedItem={setSelectedItem} />}
            {activeTab === 'freeboard' && <FreeBoard handleTabClick={handleTabClick} setSelectedItem={setSelectedItem} />}
            {activeTab === 'exchangelearningtips' && <ExchangeLearningTips handleTabClick={handleTabClick} setSelectedItem={setSelectedItem} />}
            {activeTab === 'clubboard' && <ClubBoard handleTabClick={handleTabClick} setSelectedItem={setSelectedItem} />}
            {activeTab === 'writing' && <Writing handleTabClick={handleTabClick} currentBoard={board} />}
            {activeTab === 'detailview' && <DetailView idx={idx} handleTabClick={handleTabClick} />}
          </div>
        </main>
      </CommunityContainer>
    </FadeInContainer>
  );
};

export default Community;
