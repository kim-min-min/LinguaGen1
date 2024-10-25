import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format } from "date-fns";
import { useParams, useNavigate } from 'react-router-dom';

const DetailView = ({ handleTabClick }) => {
    const { board, idx } = useParams();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // idx를 사용하여 서버에서 해당 게시글 데이터를 가져옵니다.
        fetch(`http://localhost:8085/api/community/${idx}`)
            .then(response => response.json())
            .then(data => setSelectedItem(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [idx]);

    const boardTitles = {
        notice: '공지사항',
        freeboard: '자유게시판',
        exchangelearningtips: '학습 팁 교환',
        clubboard: '동아리 게시판'
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') return;
        const comment = {
            id: comments.length + 1,
            author: '사용자',
            content: newComment,
            date: new Date().toLocaleString(),
        };
        setComments([...comments, comment]);
        setNewComment('');
    };

    if (!selectedItem) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="w-full bg-white rounded-md flex flex-col justify-start items-center min-h-screen p-8">
            <div className="w-full flex flex-col justify-start items-start mb-4">
                <div className="w-full flex justify-between items-center border-b pb-2">
                    <div>
                        <p className="text-green-500 font-bold">{boardTitles[board]}</p>
                        <h2 className="text-2xl font-bold mb-1">{selectedItem.title}</h2>
                        <div className="text-gray-500 flex items-center space-x-2">
                            <span>{selectedItem.nickname ? selectedItem.nickname : (selectedItem.userId.includes('@') ? selectedItem.userId.split('@')[0] : selectedItem.userId)}</span>
                            <span>·</span>
                            <span>{format(new Date(selectedItem.createdAt), 'yyyy-MM-dd')}</span>
                            <span>· 조회 {selectedItem.viewCount}</span>
                            <span>· 댓글 {comments.length}</span>
                        </div>
                    </div>
                    <div>
                        <Button className="mr-2">이전글</Button>
                        <Button className="mr-2">다음글</Button>
                        <Button onClick={() => navigate(`/community/${board}`)}>목록</Button>
                    </div>
                </div>
            </div>

            <div className="w-full bg-transparent p-4 rounded-md mb-8">
                <p className="mb-4">{selectedItem.content}</p>
            </div>

            <div className="w-full flex items-center mb-4">
                <img
                    src="https://via.placeholder.com/40"
                    alt="작성자 아바타"
                    className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                    <Button className="text-sm bg-transparent" variant="link">
                        {selectedItem.nickname ? selectedItem.nickname : (selectedItem.userId.includes('@') ? selectedItem.userId.split('@')[0] : selectedItem.userId)}님의 게시글 더보기
                    </Button>
                </div>
            </div>

            <div className="w-full border-t pt-4">
                <h3 className="font-bold text-lg mb-4">댓글</h3>
                <div className="w-full bg-gray-50 p-4 rounded-md flex items-center space-x-4 mb-4">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="유저 아바타"
                        className="w-10 h-10 rounded-full"
                    />
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="댓글을 남겨보세요"
                        className="w-full bg-white p-3 rounded-md border border-gray-300"
                    />
                    <Button className="text-sm bg-green-300 hover:bg-green-400" onClick={handleCommentSubmit}>
                        등록
                    </Button>
                </div>

                <div className="w-full">
                    {comments.length === 0 ? (
                        <p className="text-gray-500">아직 댓글이 없습니다.</p>
                    ) : (
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment.id} className="bg-gray-100 p-4 rounded-md mb-4">
                                    <div className="flex items-center mb-2">
                                        <img
                                            src="https://via.placeholder.com/40"
                                            alt="유저 아바타"
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <div>
                                            <p className="font-bold">{comment.author}</p>
                                            <p className="text-sm text-gray-500">{comment.date}</p>
                                        </div>
                                    </div>
                                    <p>{comment.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailView;
