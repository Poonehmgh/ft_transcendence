import React, { useContext } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { ExtendedChatUserDTO, MessageDTO } from "src/dto/chat-dto";

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

    function getUserName(userId: number): string {
        console.log("activeChat", activeChat);
        const user = activeChat.chatUsers.find(
            (e: ExtendedChatUserDTO) => e.userId === userId
        );
        return user ? user.userName : "Unknown User";
    }

    if (!activeChat) return null;

    return (
        <div className="messagesArea">
            {activeChat.messages.map((e: MessageDTO) => (
                <div key={e.id} className="messageFlexStart">
                    <span className="timeStamp">{formatTime(e.timeStamp)}</span>
                    <span className="author">{getUserName(e.authorId)}</span>
                    <div className="content">{e.content}</div>
                </div>
            ))}
        </div>
    );
}

export default MessageDisplay;
