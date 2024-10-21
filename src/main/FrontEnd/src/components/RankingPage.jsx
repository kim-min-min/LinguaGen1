import React, { useState, useEffect } from 'react';
import Header from './Header';

const RankingPage = () => {
    const initialRankingData = [
        { rank: 1, nickname: 'User1', tier: 'Gold', playtime: '10h' },
        { rank: 2, nickname: 'User2', tier: 'Silver', playtime: '9h' },
        { rank: 3, nickname: 'User3', tier: 'Bronze', playtime: '8h' },
        { rank: 4, nickname: 'User4', tier: 'Silver', playtime: '7h' },
        { rank: 5, nickname: 'User5', tier: 'Bronze', playtime: '6h' },
    ];

    const [rankingData, setRankingData] = useState(initialRankingData);
    const [filteredData, setFilteredData] = useState(initialRankingData);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'ascending' });
    const [users, setUsers] = useState([]); // User data from the server
    const [error, setError] = useState(null); // Error handling

    const tierOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Challenger'];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8085/api/users/all');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data); // Set fetched data to users state
                setRankingData(data); // Update ranking data with fetched users
                setFilteredData(data); // Ensure the displayed data reflects the fetched data
            } catch (err) {
                setError('데이터를 불러오는데 실패했습니다.');
                console.error('Fetch error:', err);
            }
        };

        fetchUsers(); // Fetch user data on component mount
    }, []);

    const getFontSize = (rank) => {
        if (rank === 1) return 'text-3xl';
        if (rank === 2) return 'text-2xl';
        if (rank === 3) return 'text-xl';
        return 'text-base';
    };

    const getFontColor = (rank) => {
        if (rank === 1) return 'text-amber-300';
        if (rank === 2) return 'text-slate-300';
        if (rank === 3) return 'text-yellow-800';
        return 'text-black';
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...filteredData].sort((a, b) => {
            if (key === 'tier') {
                const tierA = tierOrder.indexOf(a.tier);
                const tierB = tierOrder.indexOf(b.tier);
                return direction === 'ascending' ? tierA - tierB : tierB - tierA;
            } else if (key === 'playtime') {
                const playtimeA = parseInt(a.playtime.replace('h', ''));
                const playtimeB = parseInt(b.playtime.replace('h', ''));
                return direction === 'ascending' ? playtimeA - playtimeB : playtimeB - playtimeA;
            } else {
                return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
            }
        });
        setFilteredData(sortedData);
    };

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredData(rankingData);
        } else {
            const filtered = rankingData.filter((user) =>
                user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='h-screen w-full overflow-y-scroll'>
            <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
            <div className="w-full h-auto flex flex-row">
                <div
                    className="w-1/4 h-auto"
                    style={{ background: 'linear-gradient(to right, black, white)' }}
                ></div>
                <div className="w-2/4 h-auto flex flex-col justify-start items-center">
                    <img src="src/assets/imgs/RankingPage.png" alt="" />
                    <div className="font-bold text-xl my-16 select-none">
                        <p>주간 랭킹</p>
                    </div>
                    <div className="flex flex-row w-full justify-end items-center">
                        <input
                            type="text"
                            placeholder="닉네임 을 검색해 보세요"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="h-8 border-2 border-gray-400 rounded-md pl-2"
                        />
                        <img
                            src="src/assets/imgs/magnifier.png"
                            alt="검색"
                            onClick={handleSearch}
                            className="w-8 h-8 mx-8 cursor-pointer"
                        />
                    </div>
                    <div className="h-auto w-full p-12">
                        <table className="w-full">
                            <thead>
                            <tr className="text-left border-b-2 border-gray-300 select-none">
                                <th className='cursor-pointer' onClick={() => handleSort('rank')}>순위</th>
                                <th className='cursor-pointer'>닉네임</th>
                                <th className='cursor-pointer' onClick={() => handleSort('tier')}>티어</th>
                                <th className='cursor-pointer' onClick={() => handleSort('playtime')}>플레이타임</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.map((user, index) => (
                                <tr
                                    key={user.id || index}
                                    className={`border-b border-gray-300 ${getFontColor(user.rank)} ${getFontSize(user.rank)}`}
                                >
                                    <td>{index + 1}</td>
                                    <td>{user.nickname}</td>
                                    <td>{user.tier || user.grade}</td>
                                    <td>{user.playtime || `${user.exp} XP`}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div
                    className="w-1/4 h-auto"
                    style={{ background: 'linear-gradient(to left, black, white)' }}
                ></div>
            </div>
        </div>
    );
};

export default RankingPage;
