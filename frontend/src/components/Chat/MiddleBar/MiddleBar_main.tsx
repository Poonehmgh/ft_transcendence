import React from "react";
import MessageInput from "./MessageInput";
import MessageDisplay from "./MessageDisplay";

// DTO
import { Chat_ChatUsersDTO, Chat_Complete } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface middleBarProps {
    activeChat: Chat_Complete | null;
}

function MiddleBar(props: middleBarProps): React.JSX.Element {
    return (
        <div className="middleBar">
            <MessageDisplay activeChat={props.activeChat} />
            <MessageInput selectedChat={props.activeChat} />
        </div>
    );
}

export default MiddleBar;
