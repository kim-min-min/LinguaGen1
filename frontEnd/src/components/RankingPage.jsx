import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Header from './Header.jsx';
import _ from 'lodash';

// 애니메이션과 스타일 컴포넌트 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const FadeInContainer = styled.div`
  animation: ${fadeIn} 1s ease-in-out;
`;

// 사이드바 스타일
const SidebarContainer = styled.div`
  width: 20rem;
  padding: 20px;
  font-size: 16px;
  height: 300px;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.2);
  border: 2px gray solid;
  border-radius: 8px;
`;

const SectionTitle = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const List = styled.ul`
  padding-left: 10px;
`;

const ListItem = styled.li`
  display: list-item;
  list-style-position: inside;
  padding: 14px;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? 'black' : '#5a5255')};
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ isActive }) => (isActive ? 'black' : 'black')};
  }
  transition: color 0.3s ease;
`;

const RankingPage = () => {
    const [rankingData, setRankingData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 14;
    const [searchTerm, setSearchTerm] = useState('');
    const [activePanel, setActivePanel] = useState('weeklyRanking');
    const [error, setError] = useState(null);

    // 각 랭킹 데이터를 저장할 상태 추가
    const [weeklyRankingData, setWeeklyRankingData] = useState([]);
    const [personalRankingData, setPersonalRankingData] = useState([]);
    const [groupRankingData, setGroupRankingData] = useState([]);

    const tierOrder = ['Challenger', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];

    useEffect(() => {
        // 개인 랭킹 데이터 fetch
        const fetchPersonalRanking = async () => {
            try {
                const response = await fetch('http://localhost:8085/api/grade/all');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setPersonalRankingData(data);
                if (activePanel === 'personalRanking') {
                    setFilteredData(data);
                    setDisplayedData(data.slice(0, itemsPerPage));
                }
            } catch (err) {
                setError('데이터를 불러오는데 실패했습니다.');
                console.error('Fetch error:', err);
            }
        };

        // 주간 랭킹 데이터 fetch (예시 - 실제 API에 맞게 수정 필요)
        const fetchWeeklyRanking = async () => {
            try {
                const response = await fetch('http://localhost:8085/api/grade/weekly');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setWeeklyRankingData(data);
                if (activePanel === 'weeklyRanking') {
                    setFilteredData(data);
                    setDisplayedData(data.slice(0, itemsPerPage));
                }
            } catch (err) {
                console.error('Weekly ranking fetch error:', err);
            }
        };

        // 단체 랭킹 데이터 fetch (예시 - 실제 API에 맞게 수정 필요)
        const fetchGroupRanking = async () => {
            try {
                const response = await fetch('http://localhost:8085/api/grade/group');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setGroupRankingData(data);
                if (activePanel === 'groupRanking') {
                    setFilteredData(data);
                    setDisplayedData(data.slice(0, itemsPerPage));
                }
            } catch (err) {
                console.error('Group ranking fetch error:', err);
            }
        };

        fetchPersonalRanking();
        fetchWeeklyRanking();
        fetchGroupRanking();
    }, []);

    // activePanel이 변경될 때 해당하는 데이터로 업데이트
    useEffect(() => {
        setPage(1);
        switch (activePanel) {
            case 'weeklyRanking':
                setFilteredData(weeklyRankingData);
                setDisplayedData(weeklyRankingData.slice(0, itemsPerPage));
                break;
            case 'personalRanking':
                setFilteredData(personalRankingData);
                setDisplayedData(personalRankingData.slice(0, itemsPerPage));
                break;
            case 'groupRanking':
                setFilteredData(groupRankingData);
                setDisplayedData(groupRankingData.slice(0, itemsPerPage));
                break;
            default:
                break;
        }
    }, [activePanel]);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop === clientHeight) {
            loadMore();
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        const start = (nextPage - 1) * itemsPerPage;
        const end = nextPage * itemsPerPage;
        
        if (start < filteredData.length) {
            setDisplayedData([...displayedData, ...filteredData.slice(start, end)]);
            setPage(nextPage);
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredData(rankingData);
            setDisplayedData(rankingData.slice(0, itemsPerPage));
        } else {
            const filtered = rankingData.filter((user) =>
                user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
            setDisplayedData(filtered.slice(0, itemsPerPage));
        }
        setPage(1);
    };

    if (error) return <p>{error}</p>;

    return (
        <FadeInContainer className='flex flex-col items-center justify-start h-screen w-full relative overflow-y-auto custom-scrollbar'>
            <BackgroundVideo autoPlay muted loop>
                <source src='src/assets/video/MainBackground.mp4' type='video/mp4' />
            </BackgroundVideo>
            <Header />

            <main className='w-full h-min-screen grid grid-cols-12 gap-4 p-4 pt-0 mt-4 flex flex-col justify-start items-start'>
                {/* 왼쪽 사이드바 */}
                <div className='col-span-3 col-start-2 flex flex-col gap-8 items-center'>
                    <SidebarContainer>
                        <SectionTitle className='jua-regular text-2xl'>랭킹</SectionTitle>
                        <List className='jua-regular text-xl'>
                            <ListItem
                                isActive={activePanel === 'weeklyRanking'}
                                onClick={() => setActivePanel('weeklyRanking')}
                            >
                                주간 랭킹
                            </ListItem>
                            <ListItem
                                isActive={activePanel === 'personalRanking'}
                                onClick={() => setActivePanel('personalRanking')}
                            >
                                개인 랭킹
                            </ListItem>
                            <ListItem
                                isActive={activePanel === 'groupRanking'}
                                onClick={() => setActivePanel('groupRanking')}
                            >
                                단체 랭킹
                            </ListItem>
                        </List>
                    </SidebarContainer>
                </div>

                {/* 오른쪽 메인 컨테이너 */}
                <div className='col-span-7 flex items-start justify-start flex-col backdrop-blur-[15px] max-h-[850px] overflow-y-auto custom-scrollbar' style={{ background: 'rgba(255, 255, 255, 0.2)', border : '2px gray solid', borderRadius : '8px' }} onScroll={handleScroll}>
                    {/* 검색 영역 */}
                    <div className="flex w-full justify-between my-4 pr-8">
                        <div className='pl-8 jua-regular text-xl flex items-center'>
                            <p>
                                {activePanel === 'weeklyRanking' && '주간 랭킹'}
                                {activePanel === 'personalRanking' && '개인 랭킹'}
                                {activePanel === 'groupRanking' && '단체 랭킹'}
                            </p>
                        </div>
                        <div><input
                            type="text"
                            placeholder="닉네임 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-8 border-2 border-gray-400 rounded-md pl-2 mr-2"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            검색
                        </button>
                        </div>
                    </div>

                    {/* 랭킹 테이블 */}
                    <div className="w-full bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b-2 border-gray-300">
                                    <th className="p-3">순위</th>
                                    <th className="p-3">
                                        {activePanel === 'groupRanking' ? '그룹명' : '아이디'}
                                    </th>
                                    <th className="p-3">등급</th>
                                    <th className="p-3">경험치</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedData.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-gray-200">
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">
                                            {activePanel === 'groupRanking' ? item.groupName : item.userId}
                                        </td>
                                        <td className="p-3">{tierOrder[item.grade - 1] || 'Unknown'}</td>
                                        <td className="p-3">{`${item.exp} XP`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </FadeInContainer>
    );
};

export default RankingPage;
