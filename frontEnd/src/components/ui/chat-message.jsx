import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {MessageContent} from "@/components/ui/message-content.jsx";

export const ChatMessage = ({ message, isTyping, typingText, timestamp }) => {
    return (
        <div className={`flex gap-3 ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
        } mb-4`}>
            {message.sender === 'bot' && (
                <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback className="bg-gray-100 text-xs">AI</AvatarFallback>
                </Avatar>
            )}

            <div className="flex flex-col">
                {message.sender === 'bot' && (
                    <span className="text-xs text-gray-600 mb-1">AI 튜터</span>
                )}
                <div className="flex items-end gap-2">
                    <div className={`relative max-w-[75%] px-3 py-2 ${
                        message.sender === 'user'
                            ? 'bg-[#5B36AC] text-white rounded-[16px] rounded-tr-sm'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-[16px] rounded-tl-sm shadow-sm'
                    }`}>
                        <MessageContent
                            text={message.text}
                            isTyping={isTyping}
                            typingText={typingText}
                        />
                    </div>
                    <span className={`text-[10px] pb-1 ${
                        message.sender === 'user' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                        {timestamp}
                    </span>
                </div>
            </div>

            {message.sender === 'user' && (
                <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src="/user-avatar.png" />
                    <AvatarFallback className="bg-primary text-white text-xs">ME</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};
