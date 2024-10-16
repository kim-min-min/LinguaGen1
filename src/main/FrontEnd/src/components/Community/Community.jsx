import React, { useRef } from 'react'; // useRef 추가
import styled from 'styled-components';
import Header from '../Header'; // Assuming Header is already imported
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome CSS 추가
import '../../App.css'
import { Button } from '@/components/ui/button';

const SearchBox = styled.div`
  width: fit-content;
  height: fit-content;
  position: relative;
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
  right: 0px;
  color: #ffffff;
  background-color: transparent;
`;

const Item = styled.div`
  display: list-item;
  list-style-position: inside;
  padding: 14px;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? '#334155' : '#afb9c9')}; /* 클릭된 상태일 때 색상 변경 */
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ isActive }) => (isActive ? '#334155' : 'black')}; /* hover 상태에서 색상 변경 */
  }
  transition: color 0.3s ease; /* 부드러운 색상 전환 애니메이션 */
`;

const boardData = [
  {
    title: '공지사항',
    posts: [
      { author: '프론트엔드운영자', date: '2024.10.16', views: '4,761', content: '링구아젠에 오신걸 환영합니다', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', content: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', content: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', content: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  },
  {
    title: '자유게시판',
    posts: [
      { author: '프론트엔드운영자', date: '2024.10.16', views: '4,761', content: '이거 자유게시판 맞냐?', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', content: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', content: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', content: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  },
  {
    title: '학습 팁 교환',
    posts: [
      { author: '학습팁운영자', date: '2024.10.16', views: '4,761', content: '링구아젠에 오신걸 환영합니다', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', content: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', content: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', content: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  },
  {
    title: '동아리 게시판',
    posts: [
      { author: '동아리는 역시 신이다', date: '2024.10.16', views: '4,761', content: '링구아젠에 오신걸 환영합니다', description: '인공지능사관학교에서 11월 26일자로 고생해서 만든 링구...' },
      { author: '프론트엔드운영자', date: '2024.10.15', views: '3,124', content: '새로운 업데이트', description: '이번 업데이트에는 많은 변화가...' },
      { author: '프론트엔드운영자', date: '2024.10.14', views: '5,982', content: '서버 점검 안내', description: '서버 점검이 예정되어 있습니다...' },
      { author: '프론트엔드운영자', date: '2024.10.13', views: '2,300', content: '보안 업데이트', description: '보안 업데이트가 진행될 예정입니다...' }
    ]
  }
];

const Community = () => {
    const inputRef = useRef(null); // useRef로 input 요소 참조

    const handleSearchClick = () => {
        inputRef.current.focus(); // 검색 버튼 클릭 시 input에 포커스를 줌
    };

    return (
        <div className='w-full h-full flex flex-col overflow-y-scroll custom-scrollbar'>
            <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
            <div className='w-full flex flex-col justify-center items-center my-12' style={{ height: '350px' }}>
                <h1 className='select-none'>Community</h1>
            </div>
            <div className='w-full h-auto flex justify-center items-center'>
                <div className='w-full h-full mt-12 mb-18 flex grid-cols-3 justify-center'>
                    <div className='w-1/6 h-full flex flex-col justify-center items-start p-8'>
                        <div className='col-span-2 w-full h-24'>
                            <SearchBox>
                                <SearchInput
                                    ref={inputRef} // input 요소에 ref 연결
                                    type="text"
                                    placeholder="Search..."
                                />
                                <SearchButton onClick={handleSearchClick}>
                                    <i className="fas fa-search "></i> {/* Font Awesome 아이콘 */}
                                </SearchButton>
                            </SearchBox>
                        </div>
                        <div className='w-full h-full'>
                            {boardData.map((board, index) => (
                                <Item key={index}>
                                    {board.title}
                                </Item>
                            ))}
                        </div>
                    </div>
                    <div className='w-1/2 h-full flex flex-col justify-start items-center'>
                        <div className='w-full p-8 mt-8 bg-white rounded-md grid grid-cols-6 gap-8' style={{ height: '1450px' }}>
                            {boardData.map((board, index) => (
                                <div className='flex flex-col col-span-3 row-span-3 w-full h-full' key={index}>
                                    <div className='border-slate-500 border-b-2 flex flex-row justify-between pb-2'>
                                        <p className='font-bold'>{board.title}</p>
                                        <p className='text-gray-300 cursor-pointer'>더보기 {'>'}</p>
                                    </div>
                                    {board.posts.slice(0, 4).map((post, idx) => ( // 게시판마다 4개까지 표시
                                        <div className='w-full h-42 flex flex-col border-b-2 py-2 items-start' key={idx}>
                                            <h3 className='font-bold text-lg'>{post.content}</h3>
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
                    </div>
                    <div className='w-1/6 h-full p-12 flex flex-col justify-start items-center'>
                        <div className='w-full h-48 bg-white rounded-md flex flex-col justify-start p-4'>
                            <Button className='w-full bg-green-300 text-gray-500 font-bold hover:bg-green-400'>글쓰기</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
