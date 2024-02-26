import React, { useContext, useEffect, useRef } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { SocialDataContext } from "src/contexts/SocialDataProvider";

// DTO
import { MessageDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function MessageDisplay(): React.JSX.Element {
    const { activeChat } = useContext(ChatContext);
    const { blockedUsers } = useContext(SocialDataContext);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat]);

    const formatTime = (timeStamp: Date): string => {
        const date = new Date(timeStamp);
        return date.toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!activeChat || !activeChat.messages) return <div className="messagesArea"></div>;
    if(!Array.isArray(activeChat.messages)) return <div className="messagesArea"></div>;

    return (
        <div className="messagesArea">
            {activeChat.messages.map((e: MessageDTO) => {
                if (blockedUsers?.some((user) => user.id === e.authorId)) {
                    return null;
                }
                return (
                    <div key={e.id} className="messageFlexStart">
                        <div className="nameAndTime">
                            <div className="timeStamp">{formatTime(e.timeStamp)}</div>
                            <span className="author">{e.authorName}</span>
                        </div>
                        <div className="content">{e.content}</div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageDisplay;
