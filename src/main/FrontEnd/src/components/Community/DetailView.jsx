import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DetailView = ({ handleTabClick }) => {
  const { board, idx } = useParams();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserNickname, setLoggedInUserNickname] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/api/community/${idx}`);
        setSelectedItem(response.data);
      } catch (error) {
        console.error('게시글을 불러오는 중 에러 발생:', error);
      }
    };

    fetchPostData();
  }, [idx]);

  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    const nickname = sessionStorage.getItem('nickname');
    setLoggedInUserId(userId);
    setLoggedInUserNickname(nickname);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchComments();
    }
  }, [selectedItem]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8085/api/comments/${idx}`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글을 불러오는 중 에러 발생:', error);
    }
  };

  // 댓글 입력 핸들러
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // 댓글 등록 핸들러
  const handleCommentSubmit = async () => {
    const userId = loggedInUserId || sessionStorage.getItem('id');

    if (newComment.trim() === '') return;

    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const commentData = {
      communityIdx: idx,
      content: newComment,
      userId: userId,
    };

    try {
      const response = await axios.post('http://localhost:8085/api/comments', commentData);
      setNewComment(''); // 입력란 초기화
      fetchComments(); // 댓글 목록 다시 불러오기
    } catch (error) {
      console.error('댓글을 등록하는 중 에러 발생:', error);
    }
  };

  if (!selectedItem) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="w-full bg-white rounded-md flex flex-col justify-start items-center min-h-screen p-8">
      {/* 게시글 내용 */}
      <div className="w-full flex flex-col justify-start items-start mb-4">
        <div className="w-full flex justify-between items-center border-b pb-2">
          <div>
            <p className="text-green-500 font-bold">{board}</p>
            <h2 className="text-2xl font-bold mb-1">{selectedItem.title}</h2>
            <div className="text-gray-500 flex items-center space-x-2">
              <span>{selectedItem.nickname || selectedItem.userId.split('@')[0]}</span>
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

      {/* 본문 내용 */}
      <div className="w-full bg-transparent p-4 rounded-md mb-8">
        <p className="mb-4">{selectedItem.content}</p>
      </div>

      {/* 작성자 정보 및 더보기 */}
      <div className="w-full flex items-center mb-4">
        <img
            src="https://via.placeholder.com/40"
            alt="작성자 아바타"
            className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <Button className="text-sm bg-transparent" variant="link">
            {selectedItem.nickname || selectedItem.userId.split('@')[0]}님의 게시글 더보기
          </Button>
        </div>
      </div>

      {/* 댓글 입력 및 등록 버튼 */}
      <div className="w-full border-t pt-4">
        <h3 className="font-bold text-lg mb-4">댓글</h3>
        <div className="w-full bg-gray-50 p-4 rounded-md flex items-center space-x-4 mb-4">
          <img
              src="https://via.placeholder.com/40"
              alt="유저 아바타"
              className="w-10 h-10 rounded-full"
          />
          <p>{loggedInUserNickname || loggedInUserId}</p>
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

        {/* 댓글 목록 */}
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
                          <p className="font-bold">{comment.nickname || comment.userId}</p>
                          <p className="text-sm text-gray-500">
                            작성 날짜: {format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                            {comment.updatedAt && (
                                <span> | 수정 날짜: {format(new Date(comment.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                            )}
                          </p>
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
