import React from "react";

// DTO
import { Chat_Complete } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface messageDisplayProps {
    activeChat: Chat_Complete | null;
}

function MessageDisplay(props: messageDisplayProps): React.JSX.Element {
    const formatTime = (timeStamp: Date): string => {
        const date = new Date(timeStamp);
        return date.toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!props.activeChat.messages) return null;

    return (
        <div className="messagesArea">
            {props.activeChat.messages.map((message, index) => (
                <div key={index} className="messageFlexStart">
                    <span className="timeStamp">{formatTime(message.timeStamp)}</span>
                    <span className="author">{message.authorId}</span>
                    <div className="content">{message.content}</div>
                </div>
            ))}
        </div>
    );
}

export default MessageDisplay;
