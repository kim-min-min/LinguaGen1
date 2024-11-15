import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ChatMessage } from '@/components/ui/chat-message';
import { MessageContent } from '@/components/ui/message-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChatInsetContent = ({
                            activeRoomId,
                            chatRooms,
                            addNewChatRoom,
                            sendMessage
                          }) => {
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef({});
  const typingTimeoutRef = useRef(null);

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 새 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [chatRooms, typingText]);

  // 채팅방 변경 시 타이핑 상태 초기화
  useEffect(() => {
    setIsTyping(false);
    setTypingText('');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [activeRoomId]);

  // 새 메시지 감지 및 타이핑 애니메이션
  useEffect(() => {
    const currentMessages = chatRooms[activeRoomId];
    if (!currentMessages) return;

    const currentLength = currentMessages.length;
    const prevLength = prevMessagesLengthRef.current[activeRoomId] || 0;

    // 새 메시지가 추가되었고, 그것이 봇의 메시지인 경우에만 타이핑 애니메이션 시작
    if (currentLength > prevLength &&
        currentMessages[currentLength - 1].sender === 'bot') {
      const message = currentMessages[currentLength - 1].text;
      let index = 0;

      setIsTyping(true);
      setTypingText('');

      const typeNextChar = () => {
        if (index < message.length) {
          setTypingText(prev => prev + message[index]);
          index++;
          typingTimeoutRef.current = setTimeout(typeNextChar, 20);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();
    }

    // 현재 메시지 수 업데이트
    prevMessagesLengthRef.current[activeRoomId] = currentLength;

    // 클린업 함수
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatRooms, activeRoomId]);

  const formatTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
      <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col flex-1 rounded-lg bg-white shadow-sm">
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">{activeRoomId}</h3>
            <Button
                variant="ghost"
                size="sm"
                onClick={addNewChatRoom}
                className="text-muted-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* 채팅 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatRooms[activeRoomId]?.map((message, index) => {
              const isLastBotMessage =
                  index === chatRooms[activeRoomId].length - 1 &&
                  message.sender === 'bot';

              return (
                  <div
                      key={index}
                      className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    {message.sender === 'bot' && (
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage src="/bot-avatar.png" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                    )}

                    <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user'
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-muted rounded-bl-none'
                    }`}>
                      <MessageContent
                          text={isLastBotMessage ? (isTyping ? typingText : message.text) : message.text}
                          isTyping={isTyping && isLastBotMessage}
                          typingText={typingText}
                      />
                      <span className="text-xs opacity-70 mt-2 block">
                                        {formatTimestamp()}
                                    </span>
                    </div>

                    {message.sender === 'user' && (
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage src="/user-avatar.png" />
                          <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                    )}
                  </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 영역 */}
          <div className="p-4 border-t">
            <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const input = e.target.elements.message;
                  if (input.value.trim() && !isTyping) {
                    try {
                      await sendMessage(input.value);
                      input.value = '';
                    } catch (error) {
                      console.error('메시지 전송 오류:', error);
                    }
                  }
                }}
                className="flex gap-2"
            >
              <Input
                  name="message"
                  placeholder="메시지를 입력하세요..."
                  className="flex-1"
                  disabled={isTyping}
              />
              <Button type="submit" disabled={isTyping}>
                전송
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default ChatInsetContent;