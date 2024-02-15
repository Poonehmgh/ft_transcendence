import React, { useContext } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { MessageDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function MessageDisplay(): React.JSX.Element {
    const { activeChat } = useContext(ChatContext);

    const formatTime = (timeStamp: Date): string => {
        const date = new Date(timeStamp);
        return date.toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!activeChat) return null;

    return (
        <div className="messagesArea">
            {activeChat.messages.map((e: MessageDTO) => (
                <div key={e.id} className="messageFlexStart">
                    <span className="timeStamp">{formatTime(e.timeStamp)}</span>
                    <span className="author">{e.authorId}</span>
                    <div className="content">{e.content}</div>
                </div>
            ))}
        </div>
    );
}

export default MessageDisplay;
