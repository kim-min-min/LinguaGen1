import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChatMessage } from '@/components/ui/chat-message';
import { MessageContent } from '@/components/ui/message-content';


const ChatInterface = ({
                           messages = [],
                           onSendMessage,
                           activeRoomId,
                           onClose,
                           onMinimize
                       }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState('');
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // 새 메시지가 올 때마다 스크롤 맨 아래로
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingText]);

    // 메시지 타이핑 효과
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender === 'bot') {
                setIsTyping(true);
                setTypingText('');

                const text = lastMessage.text;
                let currentIndex = 0;

                const typeNextCharacter = () => {
                    if (currentIndex < text.length) {
                        setTypingText(prev => prev + text[currentIndex]);
                        currentIndex++;
                        typingTimeoutRef.current = setTimeout(typeNextCharacter, 20);
                    } else {
                        setIsTyping(false);
                    }
                };

                typeNextCharacter();

                return () => {
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }
                };
            }
        }
    }, [messages]);


    const handleSend = async () => {
        if (input.trim() && !isLoading && !isTyping) {
            setIsLoading(true);
            setError(null);
            try {
                await onSendMessage(input.trim());
                setInput('');
            } catch (error) {
                setError('메시지 전송에 실패했습니다. 다시 시도해주세요.');
                setTimeout(() => setError(null), 3000);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
        onMinimize?.(!isMinimized);
    };

    const formatTimestamp = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    // 챗봇 설명 메시지
    const getBotDescription = (roomId) => {
        switch(roomId) {
            case 'Room_1':
                return '영어 문법과 작문을 도와주는 튜터입니다.';
            case 'Room_2':
                return '영어 회화와 발음을 도와주는 튜터입니다.';
            case 'Room_3':
                return '영어 독해와 어휘를 도와주는 튜터입니다.';
            default:
                return '영어 학습을 도와주는 튜터입니다.';
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-50/50 shadow-xl rounded-xl overflow-hidden border-0">
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 ring-2 ring-gray-100">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600">AI</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-800">AI Tutor</h3>
                        <p className="text-xs text-gray-500">영어 학습을 도와주는 튜터입니다</p>
                    </div>
                </div>
            </div>

            <div className="h-[600px] overflow-y-auto px-6 py-8 bg-gradient-to-b from-gray-50/50 to-white">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            message={msg}
                            isTyping={isTyping && index === messages.length - 1}
                            typingText={typingText}
                            timestamp={formatTimestamp()}
                        />
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 min-h-[44px] max-h-[144px] resize-none rounded-xl border border-gray-200
                                bg-gray-50 px-4 py-3 text-sm placeholder-gray-400
                                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20
                                transition-all duration-200"
                        rows={1}
                        disabled={isLoading || isTyping}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || isTyping}
                        className="shrink-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl
                                transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                shadow-sm hover:shadow-md active:shadow-sm"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ChatInterface;