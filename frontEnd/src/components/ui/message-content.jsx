export const MessageContent = ({ text, isTyping, typingText }) => {
    const formatText = (content) => {
        return content.split('\n').map((line, i) => {
            if (!line.trim()) return null;

            // 제목 (학습자 프로필, 개선 방안 등)
            if (line.includes('chat-section')) {
                const match = line.match(/<div class='chat-section'>(.*?)<\/div>/);
                if (match && match[1]) {
                    return (
                        <div key={i} className="font-bold text-[14px] mb-2 mt-1">
                            {match[1].trim()}
                        </div>
                    );
                }
            }

            // bullet point 항목
            if (line.trim().startsWith('•')) {
                const parts = line.substring(1).trim().split(':');
                const title = parts[0];
                const description = parts.length > 1 ? parts.slice(1).join(':') : '';

                return (
                    <div key={i} className="flex gap-2 mb-1.5 text-[13px] leading-relaxed">
                        <span className="text-gray-400">•</span>
                        <div>
                            <span className="font-medium">{title}</span>
                            {description && (
                                <span className="text-gray-600">: {description}</span>
                            )}
                        </div>
                    </div>
                );
            }

            // 번호 리스트
            const numberMatch = line.match(/^(\d+)\.(.+)/);
            if (numberMatch) {
                const [, number, content] = numberMatch;
                return (
                    <div key={i} className="flex gap-2 mb-1.5 text-[13px] leading-relaxed">
                        <span className="text-gray-500 min-w-[16px]">{number}.</span>
                        <span>{content.trim()}</span>
                    </div>
                );
            }

            // 일반 텍스트
            return (
                <div key={i} className="text-[13px] leading-relaxed mb-1.5">
                    {line.trim()}
                </div>
            );
        }).filter(Boolean);
    };

    return (
        <div className="space-y-0.5">
            {formatText(isTyping ? typingText : text)}
            {isTyping && (
                <div className="flex gap-1 mt-1">
                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"/>
                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"/>
                    <span className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"/>
                </div>
            )}
        </div>
    );
};